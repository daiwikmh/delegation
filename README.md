# ⚡ Gasless DEX

A gasless decentralized exchange enabling seamless token swaps without users paying gas. Powered by meta-transactions and relayers, users simply sign trades, and the protocol executes them on-chain.

## 🚀 Features

- **Gasless Trading** – Users sign trades; relayers pay the gas.
- **Meta-Transaction Support** – EIP-712 based signature flow.
- **Flexible Settlement** – AMM or orderbook-based.
- **Relayer Service** – Handles transaction submission.
- **ERC-20 Token Compatible** – Works with standard tokens.

---

## 🏗️ Architecture Overview


1. Users sign trade requests off-chain.
2. Relayer receives signed requests and submits them to the blockchain.
3. Smart contracts verify and settle the trade.

---

## 📦 Tech Stack

- **Smart Contracts**: Solidity, OpenZeppelin
- **Frontend**: React, TypeScript, Wagmi, Ethers.js
- **Backend Relayer**: Node.js, Express, Ethers
- **Blockchain**: EVM-compatible (Ethereum, Polygon, Base, etc.)

---
##🔄 Flow Summary
User selects trade on frontend.

Meta-transaction is created and signed via wallet.

Relayer receives signed message and submits it on-chain.

Smart contract validates signature, nonce, deadline.

Trade executes and tokens are transferred.

##⚖️ Security Considerations
✅ Nonce management for replay protection

✅ Signature verification with domain separation (EIP-712)

✅ Rate limiting for public relayers

✅ Relayer whitelisting (optional)
