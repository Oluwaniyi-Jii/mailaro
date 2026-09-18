import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Mailaro | Intelligence for your outbox",
  description: "Next-generation email tracking and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} font-sans antialiased bg-slate-50 text-slate-950 selection:bg-brand-100 selection:text-brand-900`}
      >
        {children}
      </body>
    </html>
  );
}
