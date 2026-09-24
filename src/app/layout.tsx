import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import "katex/dist/katex.min.css";
import "./globals.css";

const siteUrl = "https://classicalcryptotoday.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "An educational hub for today's classical cryptography — RSA, ECC, AES, TLS — the algorithms post-quantum cryptography is replacing.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Classical Crypto Today",
  description,
  openGraph: {
    title: "Classical Crypto Today",
    description,
    url: siteUrl,
    siteName: "Classical Crypto Today",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Classical Crypto Today",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <MobileNav />
          <Breadcrumb />
          <main className="min-w-0 flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
