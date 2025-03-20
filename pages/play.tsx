import { useState } from 'react';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButton } from '../components/Game/ChoiceButton';
import { FaHandRock, FaHandPaper, FaHandScissors, FaRedo, FaCoins, FaWallet } from 'react-icons/fa';
import { GiSpinningSword } from 'react-icons/gi';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'Win' | 'Loss' | 'Tie';

function calculateResult(userChoice: Choice, computerChoice: Choice): GameResult {
  if (userChoice === computerChoice) return 'Tie';
  if (userChoice === 'rock') return computerChoice === 'scissors' ? 'Win' : 'Loss';
  if (userChoice === 'paper') return computerChoice === 'rock' ? 'Win' : 'Loss';
  if (userChoice === 'scissors') return computerChoice === 'paper' ? 'Win' : 'Loss';
  return 'Tie';
}

const HOUSE_ACCOUNT_PUBKEY = new PublicKey("BAUkJe7i5u5J9hUJDDwmyJC8SKCXJ6YEZdQaUsPo3JeN");

export default function PlayPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [result, setResult] = useState<GameResult | ''>('');
  const [selectedChoice, setSelectedChoice] = useState<Choice | ''>('');
  const [computerChoice, setComputerChoice] = useState<Choice | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  interface WalletError extends Error {
    code?: number;
  }

  const [currentStep, setCurrentStep] = useState<'awaiting-approval' | 'processing' | 'finalizing' | null>(null);

  // Send fee transaction with 1000 lamports (0.000001 SOL equivalent)
  const sendFeeTransaction = async (): Promise<string | null> => {
    if (!publicKey) return null;
    const feeLamports = 1000;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: HOUSE_ACCOUNT_PUBKEY,
        lamports: feeLamports,
      })
    );
    try {
      const signature = await sendTransaction(tx, connection);
      return signature;
    } catch (error: unknown) {
      console.error("Fee payment failed:", error);
      if (error instanceof Error) {
        const walletError = error as WalletError;
        if (walletError.message.includes("User rejected") || walletError.code === 4001) {
          toast.error("Transaction rejected. Please approve the transaction to continue.");
        } else {
          toast.error("Fee payment failed. Please try again.");
        }
      }
      return null;
    }
  };

  const handlePlay = async (choice: Choice) => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    setIsLoading(true);
    setSelectedChoice(choice);
    setCurrentStep('awaiting-approval');
    try {
      const signature = await sendFeeTransaction();
      if (!signature) {
        setIsLoading(false);
        setCurrentStep(null);
        return;
      }
      setCurrentStep('processing');
      await connection.confirmTransaction(signature, 'processed');
      toast.success("Fee paid successfully!");
      setCurrentStep('finalizing');
      await new Promise(resolve => setTimeout(resolve, 800));
      const compChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(compChoice);
      const computedResult = calculateResult(choice, compChoice);
      setResult(computedResult);

      // Post game result.
      // For win: +2000 lamports (0.000002 SOL), for loss: -1000 lamports (0.000001 SOL)
      const payload = {
        publicKey: publicKey.toBase58(),
        result: computedResult,
        amount: computedResult === 'Win' ? 2000 : computedResult === 'Loss' ? -1000 : 0,
        yourChoice: choice,
        computerChoice: compChoice,
      };

      await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

    } catch (error) {
      console.error("Game error:", error);
      toast.error("An error occurred during the game. Please try again.");
    } finally {
      setIsLoading(false);
      setCurrentStep(null);
    }
  };

  const resetGame = () => {
    setResult('');
    setSelectedChoice('');
    setComputerChoice('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-lg px-8 py-4 rounded-2xl border border-slate-800/50 shadow-2xl">
          <h2 className="text-3xl font-bold text-cyan-300 mb-1 flex items-center justify-center gap-2">
            <FaCoins className="text-cyan-400 mr-2" /> Rock Papers Scissors
          </h2>
        </div>
      </motion.div>
      <div className="border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl relative">
        <motion.div 
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {choices.map((choice) => (
            <ChoiceButton
              key={choice}
              choice={choice}
              onClick={() => handlePlay(choice)}
              isSelected={selectedChoice === choice}
              disabled={isLoading || !!result}
              icon={{
                rock: <FaHandRock className="text-4xl" />,
                paper: <FaHandPaper className="text-4xl" />,
                scissors: <FaHandScissors className="text-4xl" />
              }[choice]}
              color={{
                rock: 'from-red-500/30 to-red-700/20',
                paper: 'from-blue-500/30 to-blue-700/20',
                scissors: 'from-green-500/30 to-green-700/20'
              }[choice]}
            />
          ))}
        </motion.div>
        <AnimatePresence>
          {isLoading && currentStep && (
            <motion.div
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50"
            >
              <div className="inline-flex flex-col items-center gap-4 text-cyan-400 p-8 rounded-2xl bg-slate-900/90 border border-slate-800/50 shadow-xl">
                <AnimatePresence mode="wait">
                  {currentStep === 'awaiting-approval' && (
                    <motion.div
                      key="awaiting-approval"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-6xl"
                      >
                        <FaWallet />
                      </motion.div>
                      <div className="text-xl font-bold">Approve Transaction</div>
                      <div className="text-sm text-slate-300 text-center max-w-xs">
                        Please check your wallet extension to confirm the payment.
                      </div>
                    </motion.div>
                  )}
                  {(currentStep === 'processing') && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
                      <div className="text-xl font-bold">Processing Payment</div>
                      <div className="text-sm text-slate-300 text-center">
                        Securely validating your transaction on the blockchain...
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        This usually takes 5-15 seconds
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 'finalizing' && (
                    <motion.div
                      key="finalizing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="text-6xl"
                      >
                        <GiSpinningSword />
                      </motion.div>
                      <div className="text-xl font-bold">Preparing Your Match</div>
                      <div className="text-sm text-slate-300 text-center">
                        Generating computer opponent and calculating results...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-full bg-gradient-radial from-cyan-500/5 to-transparent animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-8 relative z-10">
            <AnimatePresence>
              {selectedChoice && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center mt-10"
                >
                  <div className="text-sm text-cyan-300 mb-2 font-medium">Your Move</div>
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${
                    selectedChoice === 'rock'
                      ? 'from-red-500/30 to-red-700/20'
                      : selectedChoice === 'paper'
                      ? 'from-blue-500/30 to-blue-700/20'
                      : 'from-green-500/30 to-green-700/20'
                  } shadow-xl`}>
                    {selectedChoice === 'rock' && <FaHandRock className="text-6xl text-red-400" />}
                    {selectedChoice === 'paper' && <FaHandPaper className="text-6xl text-blue-400" />}
                    {selectedChoice === 'scissors' && <FaHandScissors className="text-6xl text-green-400" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {selectedChoice && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center text-cyan-400"
              >
                <GiSpinningSword className="text-4xl mb-2 animate-spin-slow" />
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  VS
                </div>
              </motion.div>
            )}
            <AnimatePresence>
              {computerChoice && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center mt-10"
                >
                  <div className="text-sm text-purple-300 mb-2 font-medium">Computer</div>
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${
                    computerChoice === 'rock'
                      ? 'from-red-500/30 to-red-700/20'
                      : computerChoice === 'paper'
                      ? 'from-blue-500/30 to-blue-700/20'
                      : 'from-green-500/30 to-green-700/20'
                  } shadow-xl`}>
                    {computerChoice === 'rock' && <FaHandRock className="text-6xl text-red-400" />}
                    {computerChoice === 'paper' && <FaHandPaper className="text-6xl text-blue-400" />}
                    {computerChoice === 'scissors' && <FaHandScissors className="text-6xl text-green-400" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center mt-8"
            >
              <div className={`p-8 rounded-2xl backdrop-blur-lg shadow-2xl ${
                result === 'Win'
                  ? 'bg-gradient-to-br from-green-900/30 to-cyan-900/30'
                  : result === 'Loss'
                  ? 'bg-gradient-to-br from-red-900/30 to-rose-900/30'
                  : 'bg-gradient-to-br from-slate-900/30 to-slate-800/30'
              }`}>
                <h3 className="text-2xl font-bold text-slate-100 mb-4">
                  {result === 'Win' && '🏆 Victory!'}
                  {result === 'Loss' && '💥 Defeat'}
                  {result === 'Tie' && '🤝 Draw'}
                </h3>
                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    result === 'Win'
                      ? 'bg-green-500/20 text-green-300'
                      : result === 'Loss'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-slate-600/20 text-slate-300'
                  }`}>
                    {result === 'Win' && '+0.000002 SOL'}
                    {result === 'Loss' && '-0.000001 SOL'}
                    {result === 'Tie' && '0 SOL'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-purple-600 px-8 py-3 rounded-xl font-bold hover:shadow-glow transition-all"
                >
                  <FaRedo className="text-lg" />
                  Rematch
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
}
