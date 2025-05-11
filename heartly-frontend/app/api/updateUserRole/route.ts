import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { userId, role } = await request.json();

    let supabaseResponse: NextResponse;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            },
            cookies: {
                async getAll() {
                    return (await cookies()).getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(async ({ name, value, options }) => (await cookies()).set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    );

    const { error } = await supabase.auth.admin.updateUserById(userId, {
        role: role,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User metadata updated successfully' });
}
