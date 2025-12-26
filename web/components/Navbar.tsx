"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "./ui/button";

export default function Navbar() {
    const { open } = useAppKit();
    const { isConnected, address } = useAppKitAccount();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="glass-surface rounded-2xl px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Hexagonal Zap Logo Container */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        {/* Glass Hexagon Background */}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full fill-surface stroke-border stroke-[2]">
                            <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
                        </svg>
                        {/* Animated Zap SVG */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-primary drop-shadow-[0_0_8px_rgba(85,70,255,0.6)]">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg font-extrabold tracking-tighter leading-none uppercase">Jackpot Wall</span>
                        <span className="text-[10px] text-primary font-medium tracking-widest uppercase opacity-70">Truth & Fortune</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <div className="flex items-center gap-3">
                            <span className="mono text-xs opacity-50 hidden sm:block">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                            <Button
                                onClick={() => open()}
                                variant="outline"
                                className="rounded-xl border-primary/20 hover:border-primary/50 text-xs px-4 h-9"
                            >
                                Wall Connected
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => open()}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs px-6 h-9 font-bold tracking-tight shadow-[0_0_20px_rgba(85,70,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(85,70,255,0.5)]"
                        >
                            Enter the Wall
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
