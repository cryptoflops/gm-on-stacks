"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

export function Navbar() {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();

    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">GM</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Stacks GM</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {isConnected && address ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400 font-mono hidden sm:block">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>
                                <Button onClick={() => open()} variant="outline" size="sm">
                                    <Wallet className="w-4 h-4 mr-2" />
                                    Wallet
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => open()}>
                                <Wallet className="w-4 h-4 mr-2" />
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
