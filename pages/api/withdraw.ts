// pages/api/withdraw.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import prisma from '../../lib/prisma';

const connection = new Connection(
  'https://api.devnet.solana.com',  // Using default Solana devnet endpoint
  'finalized'
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { publicKey } = req.body;
  if (!publicKey || typeof publicKey !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid publicKey' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { publicKey } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const amountSOL = user.balance;
    if (amountSOL <= 0) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const maxAirdropSOL = 2;
    const requestedSOL = Math.min(amountSOL, maxAirdropSOL);
    const lamports = Math.floor(requestedSOL * LAMPORTS_PER_SOL);

    // Retry logic for airdrop request
    let txSignature: string | undefined;
    const maxAirdropRetries = 3;
    for (let i = 0; i < maxAirdropRetries; i++) {
      try {
        txSignature = await connection.requestAirdrop(
          new PublicKey(publicKey),
          lamports
        );
        console.log(`Airdrop request succeeded on attempt ${i + 1}. TxSignature: ${txSignature}`);
        break; // Exit loop if successful
      } catch (err) {
        console.error(`Airdrop request failed on attempt ${i + 1}:`, err);
        if (i === maxAirdropRetries - 1) {
          throw new Error('Airdrop failed after multiple attempts.');
        }
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!txSignature) {
      throw new Error('No transaction signature received from airdrop.');
    }

    // Get the latest blockhash info for confirmation
    const latestBlockHash = await connection.getLatestBlockhash();

    // Confirm the transaction using Solana's built-in confirmation API
    const confirmation = await connection.confirmTransaction(
      {
        signature: txSignature,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      },
      'finalized'
    );

    if (confirmation.value?.err) {
      console.error('Transaction confirmation error:', confirmation.value.err);
      throw new Error('Transaction confirmation error.');
    }

    // Update user's balance to 0 after a successful withdrawal
    await prisma.user.update({
      where: { publicKey },
      data: { balance: 0 },
    });

    console.log(`Withdrawal successful for ${publicKey}`);
    res.status(200).json({ success: true, txSignature });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
