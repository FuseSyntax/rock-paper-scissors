import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { RpsGame } from '../target/types/rps_game';

describe('rps-game', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RpsGame as Program<RpsGame>;
  const HOUSE_ACCOUNT = anchor.web3.Keypair.generate();

  it('Initializes game state', async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    
    await program.methods.initialize()
      .accounts({
        game: gameKeypair.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameKeypair])
      .rpc();
  });

  it('Plays a game', async () => {
    const gameKeypair = anchor.web3.Keypair.generate();
    const user = provider.wallet.publicKey;

    // Fund house account
    await provider.connection.requestAirdrop(
      HOUSE_ACCOUNT.publicKey,
      1000000000 // 1 SOL
    );

    // Play game
    await program.methods.play(0) // 0 = rock
      .accounts({
        game: gameKeypair.publicKey,
        user: user,
        house: HOUSE_ACCOUNT.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([gameKeypair])
      .rpc();

    // Fetch game state
    const gameState = await program.account.gameState.fetch(gameKeypair.publicKey);
    
    console.log('Game Result:', gameState.result);
    console.log('Computer Choice:', gameState.computerChoice);
  });
});