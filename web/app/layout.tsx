import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "GM On Stacks | Choose Your Fortune",
  description: "Send a GM transaction or mint a limited edition GM Badge on the Stacks blockchain.",
  openGraph: {
    title: "GM On Stacks",
    description: "Say GM to the World. Mint the Badge.",
    images: ["https://cryptologos.cc/logos/stacks-stx-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased selection:bg-brand selection:text-white`}>
        <div className="noise-overlay"></div>
        <div className="fixed inset-0 dot-grid pointer-events-none -z-10 opacity-40"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000] pointer-events-none -z-10"></div>

        <WalletProvider>
          {children}
          <Toaster richColors closeButton position="bottom-right" />
        </WalletProvider>
      </body>
    </html>
  );
}
