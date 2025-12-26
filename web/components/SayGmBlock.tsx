"use client";

import { useState, useCallback, useEffect } from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { AppConfig, UserSession, openContractCall } from "@stacks/connect";
import { PostConditionMode, Pc } from "@stacks/transactions";
import { Button } from "./ui/button";
import { Loader2, Zap, CheckCircle, Image as ImageIcon } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_NAME, STACKS_NETWORK, GM_FEE, NFT_FEE, NETWORK_MODE } from "@/lib/config";

export function SayGmBlock() {
    const [isLoading, setIsLoading] = useState(false);
    const [txId, setTxId] = useState<string | null>(null);
    const [lastAction, setLastAction] = useState<"gm" | "nft" | null>(null);
    const { isConnected, address } = useAppKitAccount();
    const { open } = useAppKit();

    // Stacks UserSession for contract calls
    const [userSession, setUserSession] = useState<UserSession | null>(null);

    useEffect(() => {
        const appConfig = new AppConfig(["store_write", "publish_data"]);
        setUserSession(new UserSession({ appConfig }));
    }, []);

    const handleAction = useCallback(async (type: "gm" | "nft") => {
        if (!isConnected || !address) {
            open();
            return;
        }

        setIsLoading(true);
        setTxId(null);
        setLastAction(type);

        const fee = type === "gm" ? GM_FEE : NFT_FEE;
        const functionName = type === "gm" ? "say-gm" : "mint-gm-nft";

        try {
            // Post condition: sender pays exactly the required fee
            const postConditions = [
                Pc.principal(address)
                    .willSendLte(fee)
                    .ustx()
            ];

            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: functionName,
                functionArgs: [],
                postConditionMode: PostConditionMode.Deny,
                postConditions,
                onFinish: (data) => {
                    console.log("Transaction ID:", data.txId);
                    setTxId(data.txId);
                    setIsLoading(false);
                },
                onCancel: () => {
                    setIsLoading(false);
                },
            });
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    }, [isConnected, address, open]);

    return (
        <div className="w-full max-w-xl mx-auto p-1 relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-2xl blur opacity-30 animate-pulse" />

            <div className="relative glass-panel rounded-xl p-8 text-center space-y-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
                        Choose Your GM
                    </h2>
                    <p className="text-gray-400">
                        Broadcasting good vibes to the Bitcoin L2
                    </p>
                </div>

                {txId ? (
                    <div className="space-y-6 py-8">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-medium text-white">Broadcast Successful!</p>
                            <p className="text-sm text-gray-400">Your {lastAction === "nft" ? "NFT Mint" : "GM"} transaction is being processed.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <a
                                href={`https://explorer.stacks.co/txid/0x${txId}?chain=${NETWORK_MODE === 'mainnet' ? 'mainnet' : 'testnet'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                View on Explorer <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                            <Button onClick={() => setTxId(null)} variant="outline" className="w-full">
                                Awesome, do it again!
                            </Button>
                        </div>
                    </div>
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

                {!isConnected && (
                    <Button onClick={() => open()} variant="ghost" className="text-gray-500 hover:text-white transition-colors">
                        Connect wallet to start broadcasting
                    </Button>
                )}

                <p className="text-xs text-gray-600 pt-4">
                    Authenticated with Reown • Verified by Stacks
                </p>
            </div>
        </div>
    );
}
