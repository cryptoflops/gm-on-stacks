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
  other: {
    "talentapp:project_verification": "cd806882739b9b654e6dfe7476dd4ddc86b52dfd31ba100c6268d2a53377d6f3f48f29c8f2765dde21aef266f2a7617d308ea83562a23c14b8740ddecfb00628"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||(!t&&window.matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){}})();` }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased selection:bg-brand selection:text-white bg-[var(--color-surface)] text-[var(--color-foreground)]`}>
        <div className="fixed inset-0 dot-grid pointer-events-none -z-10 opacity-20"></div>

        {/* Soft Vignette and Vignette Bottom */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none -z-10"></div>

        <WalletProvider>
          {children}
          <Toaster richColors closeButton position="bottom-right" />
        </WalletProvider>
      </body>
    </html>
  );
}
