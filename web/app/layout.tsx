import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppKitProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GM on Stacks",
  description: "Mint your daily GM Badge on the Stacks blockchain. Powered by Reown AppKit.",
  openGraph: {
    title: "GM on Stacks",
    description: "Mint your daily GM Badge on the Stacks blockchain.",
    images: ["https://cryptologos.cc/logos/stacks-stx-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  );
}
