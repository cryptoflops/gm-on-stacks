"use client";

import Link from "next/link";
import { useWallet } from "@/components/WalletContext";
import { Wallet, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { isConnected, address, networkMode, setNetworkMode, connectWallet, disconnectWallet } = useWallet();
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            {/* LEFT: BRANDING */}
            <div className="flex items-center gap-5 md:gap-6">
                <img src="/assets/gm-logo.png" alt="GM on Stacks" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain shrink-0 relative -top-1 left-1 md:-top-1.5 md:left-1.5" />
                <Link href="/" className="flex items-center group opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col">
                        <span className="text-lg font-display font-bold text-white leading-none tracking-tight">GM ON STACKS</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setNetworkMode(networkMode === "mainnet" ? "testnet" : "mainnet");
                                }}
                                variant="ghost"
                                size="sm"
                                className="hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest"
                            >
                                NETWORK: <span className={networkMode === "mainnet" ? "text-amber-500/80" : "text-emerald-500/80"}>{networkMode}</span>
                                <span className="opacity-40 ml-0.5 mt-[0.5px]">⇄</span>
                            </Button>
                        </span>
                    </div>
                </Link>
            </div>

            {/* RIGHT: CONNECT WALLET */}
            <Button
                onClick={handleConnect}
                disabled={isConnecting}
                variant={isConnected ? "outline" : "primary"}
                size="md"
                className={`font-bold text-xs uppercase tracking-wider
                    ${isConnected
                        ? "bg-[#111] border-white/20 text-white hover:bg-[#222]"
                        : "bg-white text-black hover:bg-gray-200 hover:scale-105"
                    }`}
            >
                {isConnecting ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <Wallet size={14} />
                )}
                {isConnected ? truncatedAddress : "CONNECT WALLET"}
            </Button>
        </nav>
    );
}
