import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACVE — Ad Creative Variation Engine",
  description:
    "Transform approved ad concepts into scalable, multi-channel, deployment-ready assets. The creative supply chain operating system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
