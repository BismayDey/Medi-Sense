import type React from "react";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Track",
  description: "Created for health care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/bh.png" type="image/x-icon" />
      </head>
      <body>{children}</body>
    </html>
  );
}
