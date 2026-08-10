import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eFresh B2B Portal",
  description: "Customer Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
