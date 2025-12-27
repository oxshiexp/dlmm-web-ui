"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import AddLP from "../../components/AddLP"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          DLMM Add Liquidity
        </h1>
        <WalletMultiButton className="mb-4 w-full" />
        <AddLP />
      </div>
    </main>
  )
}
