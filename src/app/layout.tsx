import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Content Kit | Starter + Creator Kit Pro",
  description:
    "Launch and scale your short-form content with proven hooks, scripts, idea systems, and monetization guidance. Choose Starter Kit or Creator Kit Pro.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
