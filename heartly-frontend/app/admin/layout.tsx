import {GeistSans} from "geist/font/sans";

export default function AdminLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <body>
        <main>
            <div>
                {children}
            </div>
        </main>
        </body>
        </html>
    );
}
