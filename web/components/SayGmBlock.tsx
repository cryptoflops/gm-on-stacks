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
import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";
import { Wallet, Loader2, Send, Award, Github, Zap, CheckCircle2, LayoutDashboard, History, Globe } from "lucide-react";
import { toast } from "sonner";
import {
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
    GM_FEE,
    NFT_FEE_STREAK,
    NFT_FEE_NORMAL,
    STREAK_THRESHOLD,
    NETWORK_MODE
} from "@/lib/config";

// --- Types ---
interface StreakData {
    currentStreak: number;
    longestStreak: number;
    totalGms: number;
}

export default function SayGmBlock() {
    const { isConnected, address, connectWallet } = useWallet();
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

    const network = NETWORK_MODE === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;

    const hasStreakDiscount = streakData.currentStreak >= STREAK_THRESHOLD;
    const nftPriceDisplay = hasStreakDiscount ? "1 STX" : "33 STX";

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
    }, [network]);

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
                        const val = (finalData as any)[key];
                        if (val === undefined || val === null) return 0;
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
    }, [address, network]);

    // Initial load
    useEffect(() => {
        fetchGlobalStats();
        if (isConnected && address) {
            fetchUserStreak();
        }
    }, [isConnected, address, fetchGlobalStats, fetchUserStreak]);

    const handleAction = async (type: "gm" | "nft") => {
        if (isActionPending) return;
        if (!isConnected) {
            connectWallet();
            return;
        }

        const typeIsGm = type === "gm";
        if (typeIsGm) {
            setIsGMLoading(true);
            setLastGmTxId(null);
        } else {
            setIsNFTLoading(true);
            setLastNftTxId(null);
        }
        setIsActionPending(true);

        const fee = typeIsGm ? GM_FEE : (hasStreakDiscount ? NFT_FEE_STREAK : NFT_FEE_NORMAL);
        const functionName = typeIsGm ? "say-gm" : "mint-gm-nft";
        const loadingId = toast.loading(`Preparing to ${typeIsGm ? 'Say GM' : 'Mint Badge'}...`);

        try {
            const deployerAddress = CONTRACT_ADDRESS.split('.')[0];
            const isDeployer = address === deployerAddress;

            const postConditions = [];
            if (!isDeployer) {
                const postCondition = Pc.principal(address!).willSendEq(fee).ustx();
                postConditions.push(postCondition);
            }

            await openContractCall({
                network,
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName,
                functionArgs: [],
                postConditionMode: isDeployer ? PostConditionMode.Allow : PostConditionMode.Deny,
                postConditions,
                anchorMode: AnchorMode.Any,
                onFinish: (data) => {
                    toast.dismiss(loadingId);
                    toast.success(typeIsGm ? "GM Sent! 🚀" : "Badge Minted! 🛡️");

                    if (typeIsGm) {
                        setIsGMLoading(false);
                        setLastGmTxId(data.txId);
                    } else {
                        setIsNFTLoading(false);
                        setLastNftTxId(data.txId);
                    }
                    setIsActionPending(false);

                    setTimeout(() => {
                        fetchGlobalStats();
                        fetchUserStreak();
                    }, 2000);
                },
                onCancel: () => {
                    toast.dismiss(loadingId);
                    toast.error("Cancelled");
                    if (typeIsGm) setIsGMLoading(false);
                    else setIsNFTLoading(false);
                    setIsActionPending(false);
                },
            });
        } catch (error) {
            console.error(error);
            toast.dismiss(loadingId);
            toast.error("Something went wrong");
            if (typeIsGm) setIsGMLoading(false);
            else setIsNFTLoading(false);
            setIsActionPending(false);
        }
    };

    return (
        <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 pt-24 pb-40 text-center scale-95 md:scale-100 origin-top">

            {/* HERO */}
            <div className="mb-20 animate-in fade-in zoom-in duration-1000">
                <h1 className="font-display font-bold text-7xl md:text-9xl tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl flex flex-col items-center gap-2">
                    <span className="flex items-baseline gap-4">
                        <span className="text-gradient-animate">GM</span>
                        <span className="text-white">ON</span>
                    </span>
                    <span className="flex items-center gap-4 md:gap-6 text-white">
                        <img src="/assets/stacks-icon.png" alt="Stacks" className="w-[0.6em] h-[0.6em] object-contain invert animate-pulse-slow" />
                        STACKS
                    </span>
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-400 tracking-wide">
                    Say GM Onchain
                </p>
            </div>

            {/* WALLET CONNECTION STATE */}
            {!isConnected ? (
                <button
                    onClick={connectWallet}
                    className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full text-lg hover:scale-105 transition-transform duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
                >
                    <Wallet className="w-5 h-5" />
                    CONNECT WALLET
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                </button>
            ) : (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in items-stretch text-left">

                    {/* CARD 1: DASHBOARD */}
                    <div className="glass-card spotlight-card flex flex-col h-full bg-black/40 border-white/5">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-zinc-500" /> Dashboard
                            </h3>
                            <span className="px-2 py-1 bg-white/5 text-zinc-500 text-[10px] font-mono rounded border border-white/10 uppercase tracking-widest">
                                Profile
                            </span>
                        </div>

                        <div className="space-y-6 flex-grow">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">Your Total GMs</p>
                                    <p className="text-3xl font-display font-bold text-white">{streakData.totalGms}</p>
                                </div>
                                <div className="text-right">
                                    <CheckCircle2 size={24} className="text-green-500/50" />
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current Streak</p>
                                    <p className="text-2xl font-display font-bold text-white">{streakData.currentStreak} <span className="text-sm font-light text-gray-400">Days</span></p>
                                </div>
                                <div className="text-right">
                                    <Zap size={24} className={streakData.currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-gray-700"} />
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Best Streak</p>
                                    <p className="text-2xl font-display font-bold text-white">{streakData.longestStreak} <span className="text-sm font-light text-gray-400">Days</span></p>
                                </div>
                                <History size={20} className="text-purple-500/50" />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-zinc-500 uppercase tracking-widest flex items-center gap-1"><Globe size={10} /> World GMs</span>
                                <span className="text-white font-bold">
                                    {globalGms}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: SAY GM */}
                    <div className={`glass-card spotlight-card flex flex-col h-full bg-[#1a1225]/40 border-white/5 transition-all duration-500 ${lastGmTxId ? 'border-green-500/40 bg-green-500/5' : ''}`}>
                        {lastGmTxId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="text-green-500 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">GM Sent</h3>
                                <p className="text-gray-400 text-xs mb-8 leading-relaxed">Broadcast to the Stacks blockchain.</p>
                                <a
                                    href={`https://explorer.hiro.so/txid/${lastGmTxId}?chain=${NETWORK_MODE}`}
                                    target="_blank"
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2 mb-6"
                                >
                                    View Transaction <Award size={12} />
                                </a>
                                <button
                                    onClick={() => setLastGmTxId(null)}
                                    className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-mono"
                                >
                                    Back to GM
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-8">
                                        <h3 className="text-xl font-bold text-white">Say gm</h3>
                                        <span className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-mono rounded border border-white/10 uppercase tracking-widest">
                                            Weekly
                                        </span>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-xl p-5 mb-8 focus-within:border-purple-500/30 transition-all">
                                        <textarea
                                            value={gmMessage}
                                            onChange={(e) => setGmMessage(e.target.value)}
                                            className="w-full bg-transparent text-white font-mono text-lg outline-none resize-none placeholder:text-gray-700"
                                            rows={2}
                                            placeholder="Write gm..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => handleAction('gm')}
                                        disabled={isGMLoading || isActionPending}
                                        className="w-full py-4 bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 text-purple-200/80 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                    >
                                        {isGMLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                Send gm <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest text-center">
                                        Fee 0.1 STX • Onchain
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* CARD 3: MINT BADGE */}
                    <div className={`glass-card spotlight-card flex flex-col h-full bg-black/40 border-white/10 transition-all duration-500 ${lastNftTxId ? 'border-orange-500/40 bg-orange-500/5' : ''}`}>
                        {lastNftTxId ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Award className="text-orange-500 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Minting Badge</h3>
                                <p className="text-gray-400 text-xs mb-8 leading-relaxed">Your limited edition GM Badge is on its way.</p>
                                <a
                                    href={`https://explorer.hiro.so/txid/${lastNftTxId}?chain=${NETWORK_MODE}`}
                                    target="_blank"
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2 mb-6"
                                >
                                    Check Status <Award size={12} />
                                </a>
                                <button
                                    onClick={() => setLastNftTxId(null)}
                                    className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-mono"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-8">
                                        <h3 className="text-xl font-bold text-white underline decoration-orange-500/40 underline-offset-8">Mint Badge</h3>
                                        {hasStreakDiscount && (
                                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded border border-orange-500/30 uppercase tracking-widest animate-pulse">
                                                -97% OFF
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-8">
                                        Keep a 21+ day streak to unlock the discounted mint fee of 1 STX.
                                    </p>
                                    <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xl font-bold text-white mb-8">
                                        {nftPriceDisplay}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => handleAction('nft')}
                                        disabled={isNFTLoading || isActionPending}
                                        className="w-full py-4 bg-orange-950/10 border border-orange-500/30 text-orange-500/80 font-bold rounded-xl hover:bg-orange-600/20 hover:text-orange-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isNFTLoading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                Mint Badge <Award size={16} />
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest text-center">
                                        {hasStreakDiscount ? "Eligible for discount" : "Streak: " + streakData.currentStreak + "/21"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center gap-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest bg-gradient-to-t from-black to-transparent z-20">
                <a href="https://github.com/cryptoflops/gm-on-stacks" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
                    <Github size={12} /> GitHub
                </a>
                <a href="https://talent.app/~/ecosystems/stacks" target="_blank" className="hover:text-white transition-colors">
                    Talent Protocol
                </a>
                <a href="https://stacks.co" target="_blank" className="hover:text-white transition-colors">
                    Stacks
                </a>
            </div>
        </section>
    );
}
