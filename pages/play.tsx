// frontend/pages/play.tsx
import { useState } from 'react';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButton } from '../components/Game/ChoiceButton';
import { FaHandRock, FaHandPaper, FaHandScissors, FaRedo, FaCoins } from 'react-icons/fa';
import { GiSpinningSword } from 'react-icons/gi';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define allowed choices and game result type
type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'Win' | 'Loss' | 'Tie';

// Function to calculate the game result based on user and computer choices
function calculateResult(userChoice: Choice, computerChoice: Choice): GameResult {
  if (userChoice === computerChoice) return 'Tie';
  if (userChoice === 'rock') return computerChoice === 'scissors' ? 'Win' : 'Loss';
  if (userChoice === 'paper') return computerChoice === 'rock' ? 'Win' : 'Loss';
  if (userChoice === 'scissors') return computerChoice === 'paper' ? 'Win' : 'Loss';
  return 'Tie';
}

// Replace with your house account public key (this must match your on-chain configuration)
const HOUSE_ACCOUNT_PUBKEY = new PublicKey("BAUkJe7i5u5J9hUJDDwmyJC8SKCXJ6YEZdQaUsPo3JeN");

export default function PlayPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [result, setResult] = useState<GameResult | ''>('');
  const [selectedChoice, setSelectedChoice] = useState<Choice | ''>('');
  const [computerChoice, setComputerChoice] = useState<Choice | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  // Function to send the fee transaction (0.000001 SOL)
  const sendFeeTransaction = async (): Promise<boolean> => {
    if (!publicKey) return false;
    const feeLamports = 1_000; // 0.000001 SOL in lamports

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: HOUSE_ACCOUNT_PUBKEY,
        lamports: feeLamports,
      })
    );

    try {
      const signature = await sendTransaction(tx, connection);
      // Use a commitment level that suits your needs (here, 'processed')
      await connection.confirmTransaction(signature, 'processed');
      // toast.success(`Fee paid! Transaction: ${signature}`);
      toast.success(`Fee paid successfully!`);
      return true;
    } catch (error) {
      console.error("Fee payment failed:", error);
      toast.error("Fee payment failed. Please try again.");
      return false;
    }
  };

  const handlePlay = async (choice: Choice) => {
    if (!publicKey) {
      alert("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    setSelectedChoice(choice);

    // STEP 1: Ask user to pay the fee
    const feePaid = await sendFeeTransaction();
    if (!feePaid) {
      setIsLoading(false);
      return;
    }

    // STEP 2: Simulate a short delay to mimic processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // STEP 3: Determine computer's choice and calculate the result
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(compChoice);
    const computedResult = calculateResult(choice, compChoice);
    setResult(computedResult);
    setIsLoading(false);

    // STEP 4: Post the game result to your backend API for persistence
    const payload = {
      publicKey: publicKey.toBase58(),
      result: computedResult,
      amount: computedResult === 'Win' ? 0.000002 : computedResult === 'Loss' ? -0.000001 : 0,
      yourChoice: choice,
      computerChoice: compChoice,
    };

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log("POST /api/games response:", response.status);
      if (!response.ok) {
        console.error("Failed to update game result", response.statusText);
      }
    } catch (error) {
      console.error("Error posting game result", error);
    }
  };

  const resetGame = () => {
    setResult('');
    setSelectedChoice('');
    setComputerChoice('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Heading */}
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

      {/* Game UI */}
      <div className="border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
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

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
            >
              <div className="inline-flex flex-col items-center gap-3 text-cyan-400">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
                <div className="font-medium tracking-widest text-sm">Processing fee...</div>
              </div>
            </motion.div>
          )}
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
