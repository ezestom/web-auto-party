import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { ThemeProvider } from "@/components/common/theme-provider";
import { UrlStateProvider } from "@/components/common/url-state-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const title = "AutoParty — Your music. Automatically mixed.";
const description = "Bring your own music, create themes and let local Auto-DJ handle the transitions. Take control with a two-deck mixer, add second-screen visuals and record a WAV mix.";
const originTrialToken = process.env.NEXT_PUBLIC_HTML_IN_CANVAS_OT_TOKEN;
const googleSansCode = localFont({
  src: "./fonts/GoogleSansCode-VariableFont_wght.ttf",
  variable: "--font-google-sans-code",
  weight: "300 800",
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  title: { default: title, template: "%s | AutoParty" },
  description,
  applicationName: "AutoParty",
  keywords: ["AutoParty", "Auto-DJ", "browser DJ mixer", "local music", "party programme", "two-deck mixer"],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "AutoParty",
    locale: "en_US",
    ...(siteUrl ? { url: siteUrl, images: [{ url: "/autoparty-console.jpg", width: 1440, height: 900, alt: "AutoParty two-deck console" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(siteUrl ? { images: [new URL("/autoparty-console.jpg", siteUrl).href] } : {}),
  },
  icons: { icon: [{ url: "/autoparty-logo.png", type: "image/png" }] },
  manifest: "/autoparty.webmanifest",
};

export const viewport: Viewport = { themeColor: "#08090d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${GeistSans.variable} ${GeistMono.variable} ${googleSansCode.variable} h-full antialiased`} style={{ colorScheme: "dark" }}>
      {originTrialToken ? <head><meta httpEquiv="origin-trial" content={originTrialToken} /></head> : null}
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider><UrlStateProvider>{children}</UrlStateProvider></ThemeProvider>
      </body>
    </html>
  );
}
