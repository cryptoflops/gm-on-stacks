# GM on Stacks 🌞

Broadcasting good vibes to the Bitcoin L2. A professional, full-cycle Web3 product built on Stacks, featuring dual-transaction functionality and Reown AppKit integration.

[![Stacks](https://img.shields.io/badge/Stacks-L2-orange.svg)](https://stacks.co)
[![Clarity](https://img.shields.io/badge/Language-Clarity-blue.svg)](https://clarity-lang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

GM on Stacks is a decentralized application that allows users to start their day by broadcasting a "GM" to the Stacks blockchain. It offers two distinct experiences:
1.  **Native GM:** A low-fee (0.1 STX) transaction to broadcast a message.
2.  **GM Badge NFT:** A premium (1.0 STX) SIP-009 NFT minting experience with curated IPFS metadata.

## 🛠️ Tech Stack

-   **Smart Contracts:** Clarity (v2) on Stacks L2.
-   **Frontend:** Next.js 16 (Canary), React 19, Tailwind CSS.
-   **Wallet Integration:** [Reown AppKit](https://reown.com/) with Bitcoin/Stacks support.
-   **Storage:** IPFS for NFT assets and SIP-16 metadata.
-   **Tooling:** Clarinet for local development, custom Stacks.js scripts for deployment.

## 📦 Project Structure

```text
├── backend
│   ├── contracts           # Clarity smart contracts (gm, sip-009-trait)
│   ├── nft-metadata        # NFT assets and SIP-16 JSON metadata
│   ├── settings            # Network configurations (gitignored mnemonics)
│   └── deploy.js           # Robust v7 Stacks.js deployment script
└── web
    ├── app                 # Next.js App Router (React 19)
    ├── components          # UI components & AppKit providers
    └── lib                 # Configuration and network utilities
```

## 🚥 Quick Start

### Backend (Contracts)
1.  Install [Clarinet](https://github.com/hirosystems/clarinet).
2.  Run tests: `cd backend && clarinet test`.
3.  Deploy: Update `settings/Mainnet.toml` and run `node deploy.js mainnet`.

### Frontend (Web)
1.  Navigate to `web/`.
2.  Install dependencies: `npm install`.
3.  Set environment variables:
    ```env
    NEXT_PUBLIC_REOWN_PROJECT_ID=your_id_here
    NEXT_PUBLIC_NETWORK_MODE=mainnet
    ```
4.  Run development server: `npm run dev`.

## 🛡️ Security

-   **Paranoid-level Review:** Contracts are optimized for reentrancy and access control.
-   **Dependency Hygiene:** Upgraded to latest patched versions of Next.js and React to mitigate known vulnerabilities.
-   **Asset Integrity:** NFT metadata pinned to IPFS for permanent accessibility.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---
Built with 🧡 on Stacks by [CryptoFlops](https://github.com/cryptoflops).
