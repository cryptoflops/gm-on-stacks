"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { connect, disconnect as stacksDisconnect, isConnected as checkIsConnected } from "@stacks/connect";

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
    isConnected: false,
    address: null,
    connectWallet: () => { },
    disconnectWallet: () => { },
});

export function useWallet() {
    return useContext(WalletContext);
}

const STORAGE_KEY = "stacks-session";

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        try {
            // Check if already connected via @stacks/connect
            if (checkIsConnected()) {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const session = JSON.parse(stored);
                    if (session.address) {
                        setAddress(session.address);
                        setIsConnected(true);
                    }
                }
            }
        } catch (e) {
            // No session
        }
    }, []);

    const connectWallet = useCallback(async () => {
        try {
            // @stacks/connect v8 uses connect() which returns addresses
            const response = await connect();

            // Extract address from response
            console.log("Wallet response:", response);

            if (response && response.addresses && response.addresses.length > 0) {
                // Find the STX address - STX mainnet starts with SP, testnet with ST
                // BTC addresses start with bc1 which we need to skip
                const stxAddress = response.addresses.find(
                    (addr) => addr.address?.startsWith("SP") || addr.address?.startsWith("ST")
                );

                if (stxAddress?.address) {
                    setAddress(stxAddress.address);
                    setIsConnected(true);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ address: stxAddress.address }));
                    console.log("Connected with STX address:", stxAddress.address);
                } else {
                    console.error("No STX address found in wallet response:", response.addresses);
                }
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        stacksDisconnect();
        setAddress(null);
        setIsConnected(false);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <WalletContext.Provider value={{ isConnected, address, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
}
