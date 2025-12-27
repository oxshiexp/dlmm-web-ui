import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import DLMM from "@meteora-ag/dlmm"

/**
 * Environment variables (WAJIB ada di Vercel)
 * RPC_URL=https://api.devnet.solana.com
 * POOL_ADDRESS=xxxxxxxxxxxxxxxxxxxxxxxx
 */
const RPC = process.env.RPC_URL!
const POOL = process.env.POOL_ADDRESS!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { owner, amountX, amountY } = body

    // ===== VALIDATION =====
    if (!owner || !amountX || !amountY) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      )
    }

    const ownerPubkey = new PublicKey(owner)
    const connection = new Connection(RPC, "confirmed")

    // ===== LOAD DLMM POOL =====
    const pool = await DLMM.create(
      connection,
      new PublicKey(POOL)
    )

    // ===== BIN STRATEGY =====
    const activeBin = pool.activeBin
    const lowerBin = activeBin - 30
    const upperBin = activeBin + 30

    // ===== BUILD TRANSACTION =====
    const tx = await pool.addLiquidityByBins({
      owner: ownerPubkey,
      lowerBin,
      upperBin,
      amountX: Number(amountX),
      amountY: Number(amountY),
    })

    tx.feePayer = ownerPubkey
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
