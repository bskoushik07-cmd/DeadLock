import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deadlock.studio"),
  title: "DEADLOCK — We Build What Others Can't Unlock",
  description: "A sovereign creative engineering and motion laboratory. Bespoke WebGL visual engines, high-frequency web systems, and digital flagships.",
  keywords: ["WebGL", "Three.js", "Creative Development", "Motion Design", "Full-Stack Engineering", "GSAP"],
  authors: [{ name: "DEADLOCK Studio" }],
  openGraph: {
    title: "DEADLOCK — We Build What Others Can't Unlock",
    description: "Bespoke WebGL visual engines, high-frequency web systems, and digital flagships.",
    url: "https://deadlock.studio",
    siteName: "DEADLOCK",
    images: [
      {
        url: "/deadlock-icon.svg",
        width: 800,
        height: 800,
        alt: "DEADLOCK Studio Emblem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} bg-[#070709] text-[#F4F4F0] antialiased selection:bg-[#C6FF3D] selection:text-[#070709]`}
    >
      <body className="min-h-screen flex flex-col bg-[#070709] relative font-sans overflow-x-hidden">
        {/* Grain Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Custom Context-Aware Cursor */}
        <CustomCursor />

        {/* Smooth Scrolling Wrapper */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
