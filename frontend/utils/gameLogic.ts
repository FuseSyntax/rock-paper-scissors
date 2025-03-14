//utils/gamelogic.ts

import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { IDL } from './idl.ts'; // Your Anchor IDL

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'loss' | 'tie';

const FEE = 0.00000001; // 0.00000001 SOL

// Game logic helper
export const calculateResult = (userChoice: Choice, computerChoice: Choice): GameResult => {
  if (userChoice === computerChoice) return 'tie';
  
  const combinations: Record<Choice, Choice[]> = {
    rock: ['scissors'],
    paper: ['rock'],
    scissors: ['paper']
  };

  return combinations[userChoice].includes(computerChoice) ? 'win' : 'loss';
};

// Solana program interaction
export const playGame = async (
  choice: Choice,
  wallet: any, // Wallet context
  connection: Connection,
  programId: PublicKey
) => {
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(IDL, programId, provider);

  const choiceIndex = ['rock', 'paper', 'scissors'].indexOf(choice);
  
  try {
    const tx = await program.methods
      .playGame(choiceIndex)
      .accounts({
        user: wallet.publicKey,
        house: HOUSE_ACCOUNT_PUBKEY, // Your house account
        game: GAME_PDA, // Generated PDA
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    const txSig = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(txSig);
    
    return txSig;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
};

// Generate computer choice
export const generateComputerChoice = (): Choice => {
  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
};

// utils/gameLogic.ts
export const recordGameResult = async (publicKey: string, result: GameResult) => {
  await fetch('/api/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publicKey,
      result,
      amount: result === 'Win' ? 0.000001 : -0.000001
    })
  });
};