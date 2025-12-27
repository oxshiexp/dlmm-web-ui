"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function Home() {
  const { connected } = useWallet()
  const [amountX, setAmountX] = useState("")
  const [amountY, setAmountY] = useState("")

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            DLMM Add Liquidity
          </h1>
          <p className="text-sm text-gray-500">
            Meteora DLMM · Devnet
          </p>
        </div>

        {/* Wallet */}
        <div className="flex justify-center">
          <WalletMultiButton />
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Amount X"
            value={amountX}
            onChange={(e) => setAmountX(e.target.value)}
            disabled={!connected}
            className="w-full border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              disabled:bg-gray-100"
          />

          <input
            type="number"
            placeholder="Amount Y"
            value={amountY}
            onChange={(e) => setAmountY(e.target.value)}
            disabled={!connected}
            className="w-full border rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              disabled:bg-gray-100"
          />

          <button
            disabled={!connected}
            className={`w-full py-2 rounded-lg text-sm font-semibold text-white transition
              ${connected
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Add Liquidity
          </button>
        </div>

        {/* Hint */}
        {!connected && (
          <p className="text-xs text-center text-gray-400">
            Connect wallet to enable inputs
          </p>
        )}
      </div>
    </main>
  )
}
