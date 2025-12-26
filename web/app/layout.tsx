import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppKitProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: "Jackpot Wall | Speak Your Truth",
  description: "Win the pot by broadcasting your message to the Stacks blockchain.",
  openGraph: {
    title: "Jackpot Wall",
    description: "Speak Your Truth. Win the Pot.",
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <AppKitProvider>
          {children}
        </AppKitProvider>
      </body>
    </html>
  );
}
