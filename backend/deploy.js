const {
    makeContractDeploy,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    getAddressFromPrivateKey
} = require('@stacks/transactions');
const { STACKS_TESTNET, STACKS_MAINNET } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');
const fs = require('fs');
const path = require('path');
const toml = require('toml');

async function deploy() {
    const networkArg = process.argv[2];
    if (!['testnet', 'mainnet'].includes(networkArg)) {
        console.error('Usage: node deploy.js [testnet|mainnet]');
        process.exit(1);
    }

    const isMainnet = networkArg === 'mainnet';
    const settingsFile = isMainnet ? 'settings/Mainnet.toml' : 'settings/Testnet.toml';
    const network = isMainnet ? STACKS_MAINNET : STACKS_TESTNET;

    console.log(`🚀 Starting ${networkArg} deployment...`);

    const settingsContent = fs.readFileSync(path.join(__dirname, settingsFile), 'utf8');
    let settings;
    try {
        settings = toml.parse(settingsContent);
    } catch (e) {
        console.error(`❌ Error parsing TOML in ${settingsFile}:`, e.message);
        process.exit(1);
    }

    const mnemonic = settings.accounts && settings.accounts.deployer ? settings.accounts.deployer.mnemonic : null;

    if (!mnemonic || typeof mnemonic !== 'string' || mnemonic.includes('YOUR_')) {
        console.log(`❌ Error: Mnemonic not found or invalid in ${settingsFile}`);
        process.exit(1);
    }

    const phrase = mnemonic.trim();
    console.log(`🔑 Deriving private key...`);

    try {
        const wallet = await generateWallet({ secretKey: phrase, password: '' });
        const privateKey = wallet.accounts[0].stxPrivateKey;

        const address = getAddressFromPrivateKey(privateKey, network);

        console.log(`📡 Fetching latest nonce for ${address}...`);
        // In Stacks v7, the API URL is under network.client.baseUrl
        const apiUrl = network.client.baseUrl;
        const accountResponse = await fetch(`${apiUrl}/v2/accounts/${address}`);
        const accountData = await accountResponse.json();
        let nonce = BigInt(accountData.nonce || 0);
        console.log(`🔢 Starting Nonce: ${nonce}`);

        const contracts = [
            { name: 'sip-009-trait', path: 'contracts/sip-009-trait.clar' },
            { name: 'gm', path: 'contracts/gm.clar' }
        ];

        for (const contract of contracts) {
            console.log(`📦 Preparing ${contract.name}...`);
            const code = fs.readFileSync(path.join(__dirname, contract.path), 'utf8');

            const fee = 250000; // 0.25 STX

            const txOptions = {
                contractName: contract.name,
                codeBody: code,
                senderKey: privateKey,
                network,
                anchorMode: AnchorMode.Any,
                fee,
                nonce,
                postConditionMode: PostConditionMode.Deny,
            };

            try {
                console.log(`🔨 Building transaction for ${contract.name} (Nonce: ${nonce})...`);
                const transaction = await makeContractDeploy(txOptions);

                console.log(`📡 Broadcasting ${contract.name}...`);
                const response = await broadcastTransaction({ transaction, network });

                if (response.error) {
                    if (response.reason === 'ContractAlreadyExists') {
                        console.log(`ℹ️  ${contract.name} already exists. Skipping.`);
                    } else {
                        console.error(`❌ Error broadcasting ${contract.name}:`, response.error);
                        if (response.reason) console.error(`Reason: ${response.reason}`);
                    }
                } else {
                    console.log(`✅ ${contract.name} broadcasted! TxID: 0x${response.txid}`);
                    console.log(`View on explorer: https://explorer.hiro.so/txid/0x${response.txid}?chain=${networkArg}`);
                    nonce++;
                }
            } catch (err) {
                console.error(`❌ Error for ${contract.name}:`, err.message);
            }

            await new Promise(r => setTimeout(r, 2000));
        }
    } catch (err) {
        console.error(`❌ Mnemonic derivation failed:`, err.message);
        process.exit(1);
    }
}

deploy().catch(console.error);
