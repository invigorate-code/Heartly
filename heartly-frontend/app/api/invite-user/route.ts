// next js post route

import { createServiceRoleClient } from "@/utils/supabase/serviceRole.ts";
import { createClient } from "@/utils/supabase/server.ts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, first_name, last_name, tenant_id, facility_id, app_role } =
    await request.json();
  const origin = request.headers.get("origin");

  console.log("origin", origin);
  console.log("email", email);
  console.log("redirectTo", `${origin}/auth/accept-invite`);
  console.log("request", request);

  const supabaseAdmin = await createServiceRoleClient();
  const supabase = await createClient();

  const { data: owner, error: ownerError } = await supabase.auth.getUser();

  console.log("owner", owner);

  if (ownerError) {
    return NextResponse.json({ error: ownerError.message }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        last_name,
        first_name,
      },
    }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: userProfileData, error: userProfileError } = await supabaseAdmin
    .schema("api")
    .rpc("create_user_profile_and_add_to_tenant_and_facility", {
      user_id_parm: data.user.id,
      user_email: email,
      first_name,
      last_name,
      tenant_id,
      facility_id,
      app_role,
    });

  if (userProfileError) {
    return NextResponse.json(
      { error: userProfileError.message },
      { status: 500 }
    );
  }

  const { data: updateUser, error: updateUserError } = await supabase
    .schema("api")
    .from("user_profile")
    .update({ onboarding_completed: true })
    .eq("auth_user_id", owner.user.id);

  if (updateUserError) {
    return NextResponse.json(
      { error: updateUserError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { data, userProfileData, updateUser },
    { status: 200 }
  );
}
