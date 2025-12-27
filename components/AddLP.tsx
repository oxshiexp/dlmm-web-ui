"use client"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { Transaction } from "@solana/web3.js"

export default function AddLP() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const [amountX, setX] = useState("")
  const [amountY, setY] = useState("")

  const submit = async () => {
    if (!wallet.publicKey) return
    const res = await fetch("/api/dlmm/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: wallet.publicKey.toBase58(),
        amountX: Number(amountX),
        amountY: Number(amountY)
      })
    })
    const data = await res.json()
    const tx = Transaction.from(Buffer.from(data.tx, "base64"))
    const signed = await wallet.signTransaction(tx)
    const sig = await connection.sendRawTransaction(signed.serialize())
    alert("TX sent: " + sig)
  }

  return (
    <div>
      <input className="border p-2 w-full mb-2" placeholder="Amount X"
        value={amountX} onChange={e => setX(e.target.value)} />
      <input className="border p-2 w-full mb-4" placeholder="Amount Y"
        value={amountY} onChange={e => setY(e.target.value)} />
      <button onClick={submit}
        className="w-full bg-black text-white py-2 rounded-xl">
        Add Liquidity
      </button>
    </div>
  )
}
