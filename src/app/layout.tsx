import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "SourceWise",
  description:
    "AI-guided research discovery for students who need maps, papers, and debates.",
  icons: {
    icon: "/icon.svg",
  },
  title: {
    default: "SourceWise",
    template: "%s | SourceWise",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
