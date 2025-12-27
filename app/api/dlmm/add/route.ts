import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import DLMM from "@meteora-ag/dlmm"

const RPC = process.env.RPC_URL!
const POOL = process.env.POOL_ADDRESS!

export async function POST(req: Request) {
  try {
    const { owner } = await req.json()

    if (!owner) {
      return NextResponse.json(
        { error: "Missing owner" },
        { status: 400 }
      )
    }

    const connection = new Connection(RPC, "confirmed")
    const pool = await DLMM.create(
      connection,
      new PublicKey(POOL)
    )

    // ✅ VALID API
    const activeBin = Number(await pool.getActiveBin())

    const lowerBin = activeBin - 30
    const upperBin = activeBin + 30

    // ⛔ TIDAK add liquidity di backend
    return NextResponse.json({
      pool: POOL,
      owner,
      activeBin,
      lowerBin,
      upperBin,
      message: "Use these params on frontend to add liquidity via wallet",
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message ?? "Internal error" },
      { status: 500 }
    )
  }
}
