// frontend/pages/api/withdraw.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import prisma from '../../lib/prisma';

// Create a connection to Solana devnet
const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/YMEA2JwMZDAKAmATUjlwvrpP0Rnmc2YF', 'confirmed');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

        const lamports = Math.floor(amountSOL * LAMPORTS_PER_SOL);
        const latestBlockhash = await connection.getLatestBlockhash(); // Fetch latest blockhash

        const txSignature = await connection.requestAirdrop(new PublicKey(publicKey), lamports);
        
        // Polling method to confirm transaction
        let retries = 10;
        while (retries > 0) {
            const status = await connection.getSignatureStatus(txSignature);
            if (status?.value?.confirmationStatus === 'confirmed' || status?.value?.confirmationStatus === 'finalized') {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
            retries--;
        }

        if (retries === 0) {
            throw new Error('Transaction not confirmed in time.');
        }

        await prisma.user.update({
            where: { publicKey },
            data: { balance: 0 },
        });

        res.status(200).json({ success: true, txSignature });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
}
