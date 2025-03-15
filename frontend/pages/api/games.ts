//pages/api/games.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { publicKey, result, amount, yourChoice, computerChoice } = req.body;
    
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
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating game result:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
