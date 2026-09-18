import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
        className={`${outfit.variable} font-sans antialiased bg-slate-50 text-slate-950 selection:bg-brand-100 selection:text-brand-900`}
      >
        {children}
      </body>
    </html>
  );
}
