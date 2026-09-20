import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Texture } from "@/components/Texture";
import { site } from "@/data/site";

import "./globals.css";

const display = localFont({
  src: [{ path: "../fonts/Archivo-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const sans = localFont({
  src: [{ path: "../fonts/Inter-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "../fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/IBMPlexMono-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/*
 * 和文には、きちんとした書体が要ります。next/font/google は Google の
 * unicode-range による分割をそのまま保つため、ブラウザは数メガバイトある
 * 書体全体ではなく、そのページで使う分だけを読み込みます。
 * 先読みは、Next が日中韓の書体について推奨するとおり無効にしています。
 */
const japanese = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  preload: false,
  display: "swap",
  variable: "--font-jp",
  fallback: [
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "BIZ UDPGothic",
    "Meiryo",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${japanese.variable}`}
    >
      <body>
        <a className="skip-link" href="#project-records">
          {site.skipLink}
        </a>
        <Texture />
        <div id="page">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
