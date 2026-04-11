import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { Providers } from "./providers/providers";
import 'goey-toast/styles.css'

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Reflow",
  description: "A Realtime Flowchart editor with collaborative editing features built with Supabase and tRPC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable} ${plusJakartaSans.className} ${instrumentSerif.variable} antialiased tracking-tight bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}