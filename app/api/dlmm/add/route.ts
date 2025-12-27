import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import DLMM from "@meteora-ag/dlmm"

const RPC = process.env.RPC_URL!
const POOL = process.env.POOL_ADDRESS!

export async function POST(req: Request) {
  try {
    const { owner, amountX, amountY } = await req.json()

    if (!owner || !amountX || !amountY) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      )
    }

    const connection = new Connection(RPC, "confirmed")
    const pool = await DLMM.create(
      connection,
      new PublicKey(POOL)
    )

    // ✅ FIX TYPE + API BENAR
    const activeBin = Number(await pool.getActiveBin())
    const lowerBin = activeBin - 30
    const upperBin = activeBin + 30

    // ✅ METHOD YANG VALID
    const tx = await pool.addLiquidity({
      owner: new PublicKey(owner),
      lowerBin,
      upperBin,
      amountX: Number(amountX),
      amountY: Number(amountY),
    })

    tx.feePayer = new PublicKey(owner)
    tx.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash

    return NextResponse.json({
      tx: tx
        .serialize({ requireAllSignatures: false })
        .toString("base64"),
      lowerBin,
      upperBin,
    })
  } catch (err: any) {
    console.error("DLMM add error:", err)
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 }
    )
  }
}
