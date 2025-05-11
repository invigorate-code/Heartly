import { Metadata, Viewport } from "next";
import "@/app/globals.css";
import Providers from "@/app/providers.tsx";
import { SuperTokensInit } from "@/shared/components/supertokens/superTokensInit.tsx";

export const metadata: Metadata = {
  title: "Heartly",
  description:
    "Heartly is a comprehensive, HIPAA-compliant management system designed to streamline operations and enhance resident care in Adult Residential Facilities (ARFs) and Adult Residential Treatment Facilities (ARTFs).",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    // { rel: "apple-touch-icon", url: "/icon-192x192.png" },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <SuperTokensInit>
          <main className="min-h-screen flex flex-col heartly-font">
            <Providers>{children}</Providers>
          </main>
        </SuperTokensInit>
      </body>
    </html>
  );
}
