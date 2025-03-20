// pages/api/history.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { publicKey } = req.query;
  if (!publicKey || typeof publicKey !== 'string') {
    return res.status(400).json({ error: 'Missing public key' });
  }

  try {
    const history = await prisma.gameHistory.findMany({
      where: { userPublicKey: publicKey },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
