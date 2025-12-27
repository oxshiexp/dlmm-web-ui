import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import { DLMM } from "@meteora-ag/dlmm"

const RPC = "https://api.devnet.solana.com"
const POOL = "DLMM_POOL_ADDRESS_DEVNET"

export async function POST(req: Request) {
  const { owner, amountX, amountY } = await req.json()
  const connection = new Connection(RPC, "confirmed")
  const pool = await DLMM.create(connection, new PublicKey(POOL))

  const activeBin = pool.activeBin
  const lowerBin = activeBin - 30
  const upperBin = activeBin + 30

  const tx = await pool.addLiquidityByBins({
    owner: new PublicKey(owner),
    lowerBin,
    upperBin,
    amountX,
    amountY
  })

  tx.feePayer = new PublicKey(owner)
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  return NextResponse.json({
    tx: tx.serialize({ requireAllSignatures: false }).toString("base64")
  })
}
