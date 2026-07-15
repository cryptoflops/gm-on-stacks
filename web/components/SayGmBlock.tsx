"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/components/WalletContext";
import { openContractCall } from "@stacks/connect";
import {
    AnchorMode,
    PostConditionMode,
    Pc,
    fetchCallReadOnlyFunction,
    cvToValue,
    principalCV,
} from "@stacks/transactions";

import { Wallet, Loader2, Send, Award, Zap, CheckCircle2, LayoutDashboard, History, Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    getContractDeployer,
    getContractName,
    getStacksNetwork,
    NFT_FEE_STREAK,
    NFT_FEE_NORMAL,
    STREAK_THRESHOLD,
} from "@/lib/config";


// --- Types ---
interface StreakData {
    currentStreak: number;
    longestStreak: number;
    totalGms: number;
}


export default function SayGmBlock() {
    const { isConnected, address, networkMode, connectWallet } = useWallet();
    const [isGMLoading, setIsGMLoading] = useState(false);
    const [isNFTLoading, setIsNFTLoading] = useState(false);
    const [isActionPending, setIsActionPending] = useState(false);


    // Success States
    const [lastGmTxId, setLastGmTxId] = useState<string | null>(null);
    const [lastNftTxId, setLastNftTxId] = useState<string | null>(null);


    const [gmMessage, setGmMessage] = useState("gm");
    const [globalGms, setGlobalGms] = useState<number>(0);
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        longestStreak: 0,
        totalGms: 0
    });


    const network = getStacksNetwork(networkMode);
    const CONTRACT_ADDRESS = getContractDeployer(networkMode);
    const CONTRACT_NAME = getContractName(networkMode);

    const deployerAddress = CONTRACT_ADDRESS;
    const isDeployer = address === deployerAddress;

    const hasStreakDiscount = streakData.currentStreak >= STREAK_THRESHOLD;
    const nftPriceDisplay = isDeployer
        ? "Free (Owner)"
        : (hasStreakDiscount ? "1 STX" : "33 STX");


    // --- Fetch Global Stats ---
    const fetchGlobalStats = useCallback(async () => {
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: "get-total-gms",
                functionArgs: [],
                network,
                senderAddress: CONTRACT_ADDRESS,
            });
            if (result) {
                const data = cvToValue(result, true);
                console.log("Global GMs Data:", data);
                // Handle response wrapper { value: ... }
                let val = data;
                if (data && typeof data === 'object' && 'value' in data) {
                    val = data.value;
                }
                setGlobalGms(Number(val ?? 0));
            }
        } catch (error) {
            console.log("Global stats error:", error);
        }
    }, [network, CONTRACT_ADDRESS, CONTRACT_NAME]);


    // --- Fetch User Streak ---
    const fetchUserStreak = useCallback(async () => {
        if (!address) return;
        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: "get-user-streak",
                functionArgs: [principalCV(address)],
                network,
                senderAddress: CONTRACT_ADDRESS,
            });
            if (result) {
                const data = cvToValue(result, true);
                console.log("Streak raw data:", data);


                let finalData = data;
                // Clarity returns (ok { ... }) which cvToValue turns into { value: { ... } }
                if (data && typeof data === 'object' && 'value' in data) {
                    finalData = data.value;
                }


                if (finalData && typeof finalData === 'object') {
                    // Normalize keys and handle different possible formats
                    const getNum = (key: string) => {
                        let val = (finalData as Record<string, unknown>)[key];
                        if (val === undefined || val === null) return 0;

                        // Handle Stacks CV object wrapper (e.g. { type: 'uint', value: '1' })
                        if (typeof val === 'object' && 'value' in val) {
                            val = (val as { value: unknown }).value;
                        }

                        // Handle BigInt or String from cvToValue
                        if (typeof val === 'bigint') return Number(val);
                        if (typeof val === 'string') return parseInt(val, 10) || 0;
                        return Number(val);
                    };


                    const currentStreak = getNum('current-streak') || getNum('currentStreak') || 0;
                    const longestStreak = getNum('longest-streak') || getNum('longestStreak') || 0;
                    const totalGms = getNum('total-gms') || getNum('totalGms') || 0;


                    console.log("Parsed Streak Data:", { currentStreak, longestStreak, totalGms });


                    setStreakData({
                        currentStreak,
                        longestStreak,
                        totalGms
                    });
                }
            }
        } catch (error) {
            console.log("Streak data error:", error);
        }
    }, [address, network, CONTRACT_ADDRESS, CONTRACT_NAME]);


    // Initial load
    useEffect(() => {
        fetchGlobalStats();
        if (isConnected && address) {
            fetchUserStreak();
        }
    }, [isConnected, address, fetchGlobalStats, fetchUserStreak]);


    // ========== Handle Say GM ==========
    const handleSayGM = async () => {
        if (isActionPending) return;
        if (!isConnected) {
            connectWallet();
            return;
        }

        setIsGMLoading(true);
        setLastGmTxId(null);
        setIsActionPending(true);

        const loadingId = toast.loading("Preparing to Say GM...");

        try {
            await openContractCall({
                network,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: "say-gm",
                functionArgs: [],
                postConditionMode: PostConditionMode.Allow,
                postConditions: [],
                anchorMode: AnchorMode.Any,
                onFinish: (data) => {
                    toast.dismiss(loadingId);
                    toast.success("GM Sent! 🚀");
                    setIsGMLoading(false);
                    setLastGmTxId(data.txId);
                    setIsActionPending(false);

                    setTimeout(() => {
                        fetchGlobalStats();
                        fetchUserStreak();
                    }, 2000);
                },
                onCancel: () => {
                    toast.dismiss(loadingId);
                    toast.error("Cancelled");
                    setIsGMLoading(false);
                    setIsActionPending(false);
                },
            });
        } catch (error) {
            console.error(error);
            toast.dismiss(loadingId);
            toast.error("Something went wrong");
            setIsGMLoading(false);
            setIsActionPending(false);
        }
    };


    // ========== Handle Mint NFT ==========
    const handleMintNFT = async () => {
        if (isActionPending) return;
        if (!isConnected) {
            connectWallet();
            return;
        }

        setIsNFTLoading(true);
        setLastNftTxId(null);
        setIsActionPending(true);

        // Compute price based on actual streak
        const nftFee = hasStreakDiscount ? NFT_FEE_STREAK : NFT_FEE_NORMAL;
        const loadingId = toast.loading("Preparing to Mint Badge...");

        try {
            const deployerAddress = CONTRACT_ADDRESS.split('.')[0];
            const isDeployer = address === deployerAddress;

            // Build post conditions - user will send STX to the contract
            const postConditions = [];
            if (!isDeployer) {
                // Post condition: user sends exactly the NFT fee in microSTX
                const postCondition = Pc.principal(address!).willSendEq(nftFee).ustx();
                postConditions.push(postCondition);
            }

            // Use openContractCall for wallet-signed transactions
            await openContractCall({
                network,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: "mint-gm-nft",
                functionArgs: [],
                postConditionMode: isDeployer ? PostConditionMode.Allow : PostConditionMode.Deny,
                postConditions,
                anchorMode: AnchorMode.Any,
                onFinish: (data) => {
                    toast.dismiss(loadingId);
                    toast.success("Badge Minting! 🛡️");
                    setIsNFTLoading(false);
                    setLastNftTxId(data.txId);
                    setIsActionPending(false);

                    setTimeout(() => {
                        fetchGlobalStats();
                        fetchUserStreak();
                    }, 2000);
                },
                onCancel: () => {
                    toast.dismiss(loadingId);
                    toast.error("Cancelled");
                    setIsNFTLoading(false);
                    setIsActionPending(false);
                },
            });
        } catch (error) {
            console.error("Mint error:", error);
            toast.dismiss(loadingId);
            toast.error("Mint failed. Check console for details.");
            setIsNFTLoading(false);
            setIsActionPending(false);
        }
    };


    return (
        <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 pt-24 pb-40 text-center scale-95 md:scale-100 origin-top animate-fade-up">


            {/* HERO */}
            <div className="mb-20 animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 w-full max-w-4xl mx-auto">
                    <img src="/assets/gm-logo.png" alt="" width={96} height={96} className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl shrink-0 -mr-2 md:-mr-4 relative -top-4 md:-top-8" />
                    <h1 className="font-display font-bold text-6xl md:text-9xl tracking-[-0.03em] leading-[0.9] drop-shadow-2xl flex flex-col text-left justify-center">
                        <span className="flex items-baseline gap-3 md:gap-4">
                            <span className="text-gradient-animate">GM</span>
                            <span className="text-white">ON</span>
                        </span>
                        <span className="text-white relative -left-4 md:-left-8">
                            STACKS
                        </span>
                    </h1>
                </div>
                
                <p className="text-xl md:text-2xl font-light text-gray-400 tracking-wide text-center [text-wrap:balance]">
                    Say GM Onchain
                </p>
            </div>


            {/* WALLET CONNECTION STATE */}
            {!isConnected ? (
                <Button
                    onClick={connectWallet}
                    variant="primary"
                    size="lg"
                    className="bg-white text-black font-semibold rounded-full hover:scale-105 hover:bg-gray-200 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] group"
                >
                    <Wallet className="w-5 h-5" />
                    CONNECT WALLET
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                </Button>
            ) : (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in animate-fade-up items-stretch text-left">


                    {/* CARD 1: DASHBOARD */}
                    <div className="glass-card spotlight-card flex flex-col h-full bg-black/40 border-white/8">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-zinc-500" /> Dashboard
                            </h2>
                            <span className="px-2 py-1 bg-white/5 text-zinc-500 text-[10px] font-mono rounded border border-white/10 uppercase tracking-widest">
                                Profile
                            </span>
                        </div>


                        <div className="space-y-6 flex-grow">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div className="text-left">
                                    <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1">Your total GMs</h3>
                                    <p className="text-3xl font-display font-bold text-white tabular-nums">{streakData.totalGms}</p>
                                </div>
                                <div className="text-right">
                                    <CheckCircle2 size={24} className="text-green-500/50" />
                                </div>
                            </div>


                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div className="text-left">
                                    <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Current streak</h3>
                                    <p className="text-2xl font-display font-bold text-white tabular-nums">{streakData.currentStreak} <span className="text-sm font-light text-gray-400">Days</span></p>
                                </div>
                                <div className="text-right">
                                    <Zap size={24} className={streakData.currentStreak > 0 ? "text-orange-500 animate-pulse-slow" : "text-gray-700"} aria-label={streakData.currentStreak > 0 ? "Active streak" : "No active streak"} />
                                </div>
                            </div>


                            <div className="flex justify-between items-end">
                                <div className="text-left">
                                    <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Best streak</h3>
                                    <p className="text-2xl font-display font-bold text-white tabular-nums">{streakData.longestStreak} <span className="text-sm font-light text-gray-400">Days</span></p>
                                </div>
                                <History size={20} className="text-purple-500/50" />
                            </div>
                        </div>


                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-1"><Globe size={14} /> World GMs</span>
                                <span className="text-white font-bold tabular-nums">
                                    {globalGms}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* CARD 2: SAY GM */}
                    <div className={`glass-card spotlight-card flex flex-col h-full bg-[#1a1225]/40 border-white/8 transition-all duration-500 ${lastGmTxId ? 'border-green-500/40 bg-green-500/5' : ''}`}>
                        {lastGmTxId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="text-green-500 w-8 h-8" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">GM Sent</h3>
                                <p className="text-gray-400 text-xs mb-8 leading-relaxed">Broadcast to the Stacks blockchain.</p>
                                <a
                                    href={`https://explorer.hiro.so/txid/${lastGmTxId}?chain=${networkMode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-[0.98] flex items-center gap-2 mb-6"
                                >
                                    View Transaction <Award size={12} />
                                </a>
                                <Button
                                    onClick={() => setLastGmTxId(null)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] uppercase font-mono"
                                >
                                    Back to GM
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-8">
                                        <h2 className="text-xl font-bold text-white">Say gm</h2>
                                        <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-mono rounded border border-white/10 uppercase tracking-widest">
                                            Daily
                                        </span>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-8 focus-within:border-purple-500/30 transition-all">
                                        <label htmlFor="gm-message" className="sr-only">Write gm...</label>
                                        <textarea
                                            id="gm-message"
                                            value={gmMessage}
                                            onChange={(e) => setGmMessage(e.target.value)}
                                            className="w-full bg-transparent text-white font-mono text-lg outline-none resize-none placeholder:text-gray-700"
                                            rows={2}
                                            placeholder="Write gm..."
                                            aria-describedby="gm-hint"
                                        />
                                    </div>
                                </div>


                                <div>
                                    <Button
                                        onClick={handleSayGM}
                                        disabled={isGMLoading || isActionPending}
                                        variant="ghost"
                                        className="w-full py-4 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 text-purple-200/80 hover:text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                    >
                                        {isGMLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                Send gm <Send size={16} />
                                            </>
                                        )}
                                    </Button>
                                    <p className="mt-4 text-[10px] text-zinc-400 font-mono uppercase tracking-widest text-center" id="gm-hint">
                                        Onchain
                                    </p>
                                </div>
                            </>
                        )}
                    </div>


                    {/* CARD 3: MINT BADGE */}
                    <div className={`glass-card spotlight-card flex flex-col h-full bg-black/40 border-white/8 transition-all duration-500 ${lastNftTxId ? 'border-orange-500/40 bg-orange-500/5' : ''}`}>
                        {lastNftTxId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Award className="text-orange-500 w-8 h-8" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Minting Badge</h3>
                                <p className="text-gray-400 text-xs mb-8 leading-relaxed">Your limited edition GM Badge is on its way.</p>
                                <a
                                    href={`https://explorer.hiro.so/txid/${lastNftTxId}?chain=${networkMode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-[0.98] flex items-center gap-2 mb-6"
                                >
                                    Check Status <Award size={12} />
                                </a>
                                <Button
                                    onClick={() => setLastNftTxId(null)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] uppercase font-mono"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-8">
                                        <h2 className="text-xl font-bold text-white underline decoration-orange-500/40 underline-offset-8">Mint Badge</h2>
                                        {hasStreakDiscount && (
                                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded border border-orange-500/30 uppercase tracking-widest animate-pulse">
                                                -97% OFF
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 text-xs leading-relaxed mb-8">
                                        Keep a 21+ day streak to unlock the discounted mint fee of 1 STX.
                                    </p>
                                    <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xl font-bold text-white mb-8">
                                        {nftPriceDisplay}
                                    </div>
                                </div>


                                <div>
                                    <Button
                                        onClick={handleMintNFT}
                                        disabled={isNFTLoading || isActionPending}
                                        variant="outline"
                                        className="w-full py-4 bg-orange-950/10 border-orange-500/30 text-orange-500/80 font-bold rounded-xl hover:bg-orange-600/20 hover:text-orange-400"
                                    >
                                        {isNFTLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                Mint Badge <Award size={16} />
                                            </>
                                        )}
                                    </Button>
                                    <p className="mt-4 text-[10px] text-zinc-400 font-mono uppercase tracking-widest text-center">
                                        {hasStreakDiscount ? "Eligible for discount" : "Streak: " + streakData.currentStreak + "/21"}
                                    </p>
                                    {!hasStreakDiscount && streakData.currentStreak === 0 && (
                                        <p className="text-xs text-zinc-500 mt-1">Say gm daily for 21 days to unlock the 97% discount</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}


        </section>
    );
}