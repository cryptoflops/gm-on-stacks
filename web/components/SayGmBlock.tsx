"use client";

import React, { useState } from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { openContractCall } from "@stacks/connect";
import {
    AnchorMode,
    PostConditionMode,
    FungibleConditionCode,
    Pc
} from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";
import { Button } from "./ui/button";
import { CONTRACT_ADDRESS, CONTRACT_NAME, GM_FEE, NFT_FEE, NETWORK_MODE } from "@/lib/config";
import { MessageSquare, ShieldCheck, ExternalLink, Zap, Loader2, Image as ImageIcon } from "lucide-react";

export default function SayGmBlock() {
    const { isConnected, address } = useAppKitAccount();
    const { open } = useAppKit();
    const [isGMLoading, setIsGMLoading] = useState(false);
    const [isNFTLoading, setIsNFTLoading] = useState(false);

    const network = NETWORK_MODE === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;

    const handleAction = async (type: "gm" | "nft") => {
        if (!isConnected) {
            open();
            return;
        }

        const typeIsGm = type === "gm";
        if (typeIsGm) setIsGMLoading(true);
        else setIsNFTLoading(true);

        const fee = typeIsGm ? GM_FEE : NFT_FEE;
        const functionName = typeIsGm ? "say-gm" : "mint-gm-nft";

        try {
            const postCondition = Pc.principal(address!).willSendEq(fee).ustx();

            await openContractCall({
                network,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName,
                functionArgs: [],
                postConditionMode: PostConditionMode.Deny,
                postConditions: [postCondition],
                anchorMode: AnchorMode.Any,
                onFinish: (data) => {
                    console.log(`${type} Finished:`, data);
                    if (typeIsGm) setIsGMLoading(false);
                    else setIsNFTLoading(false);
                },
                onCancel: () => {
                    console.log(`${type} Cancelled`);
                    if (typeIsGm) setIsGMLoading(false);
                    else setIsNFTLoading(false);
                },
            });
        } catch (error) {
            console.error(`Error with ${type}:`, error);
            if (typeIsGm) setIsGMLoading(false);
            else setIsNFTLoading(false);
        }
    };

    const explorerLink = `https://explorer.hiro.so/explorer/txid/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=${NETWORK_MODE}`;

    return (
        <div className="flex flex-col gap-6 w-full max-w-xl mx-auto py-12 px-4">
            {/* Introduction Card */}
            <div className="text-center mb-8 space-y-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tighter leading-none">
                    Choose Your <span className="text-primary drop-shadow-[0_0_15px_rgba(85,70,255,0.4)]">Fortune</span>
                </h1>
                <p className="text-foreground/60 text-sm max-w-sm mx-auto">
                    Broadcast your message to the Wall or mint a limited edition badge. Speak your truth, win the pot.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Say GM Option */}
                <div className="glass-surface rounded-3xl p-8 group transition-all duration-500 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Standard Entry</div>
                            <div className="text-2xl font-black mono text-white pulse-text flex items-center gap-1 justify-end">
                                <span className="text-sm opacity-50 font-bold">0.1</span> STX
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">The Broadcast</h3>
                    <p className="text-sm text-foreground/50 mb-8 leading-relaxed flex-grow">
                        Append your voice to the global Wall. A low-fee entry to establish your presence on-chain.
                    </p>

                    <Button
                        onClick={() => handleAction("gm")}
                        disabled={isGMLoading}
                        className="w-full bg-white text-black hover:bg-white/90 rounded-2xl h-14 font-bold text-base transition-transform group-hover:scale-[1.02]"
                    >
                        {isGMLoading ? <Loader2 className="animate-spin" /> : "Speak Truth"}
                    </Button>
                </div>

                {/* Mint NFT Option */}
                <div className="glass-surface rounded-3xl p-8 relative overflow-hidden group transition-all duration-500 border-primary/20 bg-primary/[0.03] flex flex-col h-full">
                    {/* Subtle Glow Background */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 shadow-[0_0_20px_rgba(252,100,50,0.2)]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold">Premium Asset</div>
                            <div className="text-2xl font-black mono text-secondary pulse-text flex items-center gap-1 justify-end">
                                <span className="text-sm opacity-50 font-bold text-secondary/50">1.0</span> STX
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight flex items-center gap-2">
                        Legend Badge <Zap className="w-4 h-4 text-secondary fill-secondary" />
                    </h3>
                    <p className="text-sm text-foreground/50 mb-8 leading-relaxed flex-grow">
                        Mint a unique SIP-009 NFT. Permanent proof of your entry into the Wall's legacy.
                    </p>

                    <Button
                        onClick={() => handleAction("nft")}
                        disabled={isNFTLoading}
                        variant="outline"
                        className="w-full border-secondary/50 text-secondary hover:bg-secondary/10 bg-secondary/5 rounded-2xl h-14 font-bold text-base transition-transform group-hover:scale-[1.02]"
                    >
                        {isNFTLoading ? <Loader2 className="animate-spin" /> : "Claim Legacy"}
                    </Button>
                </div>
            </div>

            {/* Contract Verification Link */}
            <a
                href={explorerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-surface rounded-2xl py-4 px-6 flex items-center justify-between group grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Trust & Transparency</div>
                        <div className="mono text-[11px] font-medium truncate max-w-[150px] sm:max-w-none">
                            {CONTRACT_ADDRESS}.{CONTRACT_NAME}
                        </div>
                    </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
        </div>
    );
}
