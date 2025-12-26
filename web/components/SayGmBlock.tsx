"use client";

import React, { useState } from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { openContractCall } from "@stacks/connect";
import {
    AnchorMode,
    PostConditionMode,
    uintCV,
    FungibleConditionCode,
    createSTXPostCondition
} from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";
import { Button } from "./ui/button";
                ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Option 1: Regular GM */}
        <div className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
            <div className="h-12 w-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Say GM</h3>
            <p className="text-sm text-gray-500 mb-6 flex-grow">A simple, lightweight way to start your day on Stacks.</p>
            <div className="space-y-4">
                <p className="text-2xl font-mono">0.1 STX</p>
                <Button
                    onClick={() => handleAction("gm")}
                    disabled={isLoading}
                    className="w-full"
                    variant="outline"
                >
                    {isLoading && lastAction === "gm" ? <Loader2 className="animate-spin h-4 w-4" /> : "Broadcast GM"}
                </Button>
            </div>
        </div>

        {/* Option 2: NFT Mint */}
        <div className="flex flex-col p-6 rounded-2xl bg-primary/10 border border-primary/20 hover:border-primary transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
                <span className="bg-primary text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-tighter">Popular</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mint GM NFT</h3>
            <p className="text-sm text-gray-400 mb-6 flex-grow">Collect the official GM Badge and prove you were here.</p>
            <div className="space-y-4">
                <p className="text-2xl font-mono">1.0 STX</p>
                <Button
                    onClick={() => handleAction("nft")}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                    {isLoading && lastAction === "nft" ? <Loader2 className="animate-spin h-4 w-4" /> : "Mint Badge"}
                </Button>
            </div>
        </div>
    </div>
)}

{
    !isConnected && (
        <Button onClick={() => open()} variant="ghost" className="text-gray-500 hover:text-white transition-colors">
            Connect wallet to start broadcasting
        </Button>
    )
}

<p className="text-xs text-gray-600 pt-4">
    Authenticated with Reown • Verified by Stacks
</p>
            </div >
        </div >
    );
}
