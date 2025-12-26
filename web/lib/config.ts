import { STACKS_DEVNET, STACKS_TESTNET, STACKS_MAINNET, StacksNetwork } from "@stacks/network";

// Network selection via env var or default to devnet
type NetworkMode = "devnet" | "testnet" | "mainnet";
const NETWORK_MODE_RAW = (process.env.NEXT_PUBLIC_NETWORK_MODE || "devnet") as NetworkMode;

function getStacksNetwork(mode: NetworkMode): StacksNetwork {
    switch (mode) {
        case "mainnet": return STACKS_MAINNET;
        case "testnet": return STACKS_TESTNET;
        default: return STACKS_DEVNET;
    }
}

function getContractAddress(mode: NetworkMode): string {
    switch (mode) {
        case "mainnet": return "SP1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7M3CKVJJ";
        case "testnet": return "ST1TN1ERKXEM2H9TKKWGPGZVNVNEKS92M7MAMP23P";
        default: return "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"; // Devnet deployer
    }
}

export const NETWORK_MODE = NETWORK_MODE_RAW;
export const STACKS_NETWORK = getStacksNetwork(NETWORK_MODE_RAW);
export const CONTRACT_ADDRESS = getContractAddress(NETWORK_MODE_RAW);
export const CONTRACT_NAME = "gm";

export const APP_DETAILS = {
    name: "GM on Stacks",
    icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
};

// Reown Project ID - Get yours at https://cloud.reown.com
export const REOWN_PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "demo-project-id";

// GM Fee in microSTX (0.1 STX = 100,000 microSTX)
export const GM_FEE = 100000;

// NFT Fee in microSTX (1 STX = 1,000,000 microSTX)
export const NFT_FEE = 1000000;
