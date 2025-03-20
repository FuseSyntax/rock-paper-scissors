// pages/api/users/[publicKey].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { publicKey } = req.query;
  if (!publicKey || typeof publicKey !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid publicKey' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { publicKey },
    });
    // If not found, create one with default values.
    if (!user) {
      user = await prisma.user.create({
        data: {
          publicKey,
          wins: 0,
          losses: 0,
          ties: 0,
          balance: 0,
        },
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching/creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
