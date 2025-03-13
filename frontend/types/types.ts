export type GameChoice = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'loss' | 'tie';

export interface GameHistory {
  txSignature: string;
  userChoice: GameChoice;
  computerChoice: GameChoice;
  result: GameResult;
  wager: number;
  timestamp: number;
}

export interface GameStats {
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  totalGames: number;
  totalWagered: number;
  netProfit: number;
}

export interface SolanaProgramAccounts {
  houseAccount: PublicKey;
  programId: PublicKey;
  systemProgram: PublicKey;
}

export interface GameSession {
  publicKey: PublicKey;
  user: PublicKey;
  result: GameResult;
  userChoice: number;
  computerChoice: number;
  wager: number;
  timestamp: number;
}

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number;
  connecting: boolean;
  disconnecting: boolean;
}