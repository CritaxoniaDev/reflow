import type { Metadata } from "next";
import { Geist_Mono, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import 'goey-toast/styles.css'

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
  weight: ["600"],
});

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
      <body className={`${geistMono.variable} ${darkerGrotesque.variable} antialiased tracking-tight bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}