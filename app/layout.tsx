import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saini Harish Portfolio",
  description:
    "Purple animated Next.js portfolio for Saini Harish, Bca Software Development student at Seth G.B. Podar College.",
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
