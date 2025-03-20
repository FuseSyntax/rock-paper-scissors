// pages/api/games.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { publicKey, result, amount, yourChoice, computerChoice } = req.body;
    if (!publicKey || typeof publicKey !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid publicKey' });
    }
    try {
      await prisma.$transaction([
        prisma.gameHistory.create({
          data: {
            userPublicKey: publicKey,
            result,
            amount,
            yourChoice,
            computerChoice,
          },
        }),
        prisma.user.update({
          where: { publicKey },
          data: {
            wins: result === 'Win' ? { increment: 1 } : undefined,
            losses: result === 'Loss' ? { increment: 1 } : undefined,
            ties: result === 'Tie' ? { increment: 1 } : undefined,
            balance: result === 'Win' ? { increment: amount } : undefined,
          },
        }),
      ]);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating game result:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
