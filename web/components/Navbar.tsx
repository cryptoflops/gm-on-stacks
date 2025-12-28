"use client";

import Link from "next/link";
import { useWallet } from "@/components/WalletContext";
import { Wallet, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
    const [isConnecting, setIsConnecting] = useState(false);

    const truncatedAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

    const handleConnect = async () => {
        if (isConnecting) return;
        if (isConnected) {
            disconnectWallet();
            return;
        }
        setIsConnecting(true);
        connectWallet();
        // Reset loading state after a delay or let the context handle it 
        // (Native wallets usually resolve/reject quickly or open a popup)
        setTimeout(() => setIsConnecting(false), 2000);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-start">
            {/* LEFT: BRANDING */}
            <Link href="/" className="flex items-center gap-3 group opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-white/30 backdrop-blur-md transition-all">
                    <img src="/assets/stacks-icon.png" alt="Stacks" className="w-5 h-5 object-contain invert" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-display font-bold text-white leading-none tracking-tight">GM ON STACKS</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">NETWORK: MAINNET</span>
                </div>
            </Link>

            {/* RIGHT: CONNECT WALLET */}
            <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={`flex items-center gap-2 px-5 py-2.5 rounded shadow-lg font-bold text-xs uppercase tracking-wider transition-all
                    ${isConnected
                        ? "bg-[#111] border border-white/20 text-white hover:bg-[#222]"
                        : "bg-white text-black hover:bg-gray-200 hover:scale-105"
                    }`}
            >
                {isConnecting ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Wallet size={14} />
                )}
                {isConnected ? truncatedAddress : "CONNECT WALLET"}
            </button>
        </nav>
    );
}
