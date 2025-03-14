//utils/solana.ts

import { Program, AnchorProvider } from '@project-serum/anchor';

export const playGame = async (choice: Choice) => {
  const provider = new AnchorProvider(connection, wallet, {});
  const program = new Program(IDL, PROGRAM_ID, provider);
  
  const tx = await program.rpc.play(choice, {
    accounts: {
      user: wallet.publicKey,
      house: HOUSE_ACCOUNT,
      game: gamePDA,
    },
  });

  return tx;
};