"use client";

import { useEffect, useState } from "react";
import { createAppKit } from "@reown/appkit/react";
import { BitcoinAdapter } from "@reown/appkit-adapter-bitcoin";
import { REOWN_PROJECT_ID, APP_DETAILS } from "@/lib/config";

// Stacks Network Definitions
const networks = [
    {
        id: "stacks:2147483648",
        chainId: 2147483648,
        name: "Stacks Testnet",
        nativeCurrency: {
            name: "Stacks",
            symbol: "STX",
            decimals: 6,
        },
        rpcUrls: {
            default: {
                http: ["https://api.testnet.hiro.so"],
            },
        },
        blockExplorers: {
            default: {
                name: "Stacks Explorer",
                url: "https://explorer.stacks.co/?chain=testnet",
            },
        },
    },
    {
        id: "stacks:1",
        chainId: 1,
        name: "Stacks Mainnet",
        nativeCurrency: {
            name: "Stacks",
            symbol: "STX",
            decimals: 6,
        },
        rpcUrls: {
            default: {
                http: ["https://api.hiro.so"],
            },
        },
        blockExplorers: {
            default: {
                name: "Stacks Explorer",
                url: "https://explorer.stacks.co",
            },
        },
    },
] as const;

let appKitInitialized = false;

export function AppKitProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!appKitInitialized && typeof window !== "undefined") {
            const bitcoinAdapter = new BitcoinAdapter();

            createAppKit({
                adapters: [bitcoinAdapter],
                projectId: REOWN_PROJECT_ID,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                networks: networks as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                defaultNetwork: networks[0] as any,
                metadata: {
                    name: APP_DETAILS.name,
                    description: "Mint your daily GM Badge on Stacks",
                    url: window.location.origin,
                    icons: [APP_DETAILS.icon],
                },
                features: {
                    analytics: false,
                },
            });

            appKitInitialized = true;
        }
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <>{children}</>;
}
