import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitae — Create a Professional CV in Minutes",
  description:
    "Choose from elegant, ATS-friendly templates, customize with your details, and download a professional CV that helps you stand out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lora:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
