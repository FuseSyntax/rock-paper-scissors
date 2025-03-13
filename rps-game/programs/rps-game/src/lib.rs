use anchor_lang::prelude::*;
use solana_program::system_program;

declare_id!("B7w4FD8f6geF7TfKzeVb48NtNWXjiWWCqWayPd4N69DJ");

#[program]
pub mod rps_game {
    use super::*;

    const FEE: u64 = 100; // 0.00000001 SOL (100 lamports)

    // Initialize game state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.user = *ctx.accounts.user.key;
        game.result = 0; // 0 = pending, 1 = win, 2 = loss, 3 = tie
        Ok(())
    }

    // Main game handler
    pub fn play(ctx: Context<Play>, user_choice: u8) -> Result<()> {
        let game = &mut ctx.accounts.game;
        
        // Deduct fee from user
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? -= FEE;
        **ctx.accounts.house.to_account_info().try_borrow_mut_lamports()? += FEE;

        // Generate computer choice (pseudo-random)
        let computer_choice = generate_computer_choice(ctx.accounts.user.key());
        game.computer_choice = computer_choice;

        // Calculate result
        let result = calculate_result(user_choice, computer_choice);
        game.result = result as u8;

        // Handle payout if win
        if result == GameResult::Win {
            **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += 2 * FEE;
            **ctx.accounts.house.to_account_info().try_borrow_mut_lamports()? -= 2 * FEE;
        }

        Ok(())
    }
}

// Generate pseudo-random computer choice
fn generate_computer_choice(user_key: &Pubkey) -> u8 {
    let seed = user_key.to_bytes();
    let hash = keccak::hash(&seed);
    (hash.to_bytes()[0] % 3) // 0=rock, 1=paper, 2=scissors
}

// Game result calculation
fn calculate_result(user_choice: u8, computer_choice: u8) -> GameResult {
    if user_choice == computer_choice {
        return GameResult::Tie;
    }
    
    match (user_choice, computer_choice) {
        (0, 2) | (1, 0) | (2, 1) => GameResult::Win,
        _ => GameResult::Loss,
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + GameState::LEN)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, address = HOUSE_ACCOUNT_PUBKEY)] // Your house wallet address
    pub house: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GameState {
    pub user: Pubkey,
    pub computer_choice: u8,
    pub result: u8, // 0=pending, 1=win, 2=loss, 3=tie
    pub wager: u64,
}

#[derive(PartialEq)]
enum GameResult {
    Win = 1,
    Loss = 2,
    Tie = 3,
}