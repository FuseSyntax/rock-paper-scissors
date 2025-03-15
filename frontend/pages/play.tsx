// frontend/pages/play.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButton } from '../components/Game/ChoiceButton';
import { 
  FaHandRock, 
  FaHandPaper, 
  FaHandScissors,
  FaRedo,
  FaCoins
} from 'react-icons/fa';
import { GiSpinningSword } from 'react-icons/gi';
import { useWallet } from '@solana/wallet-adapter-react';

// Define allowed choices and game result type
type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'Win' | 'Loss' | 'Tie';

// Function to calculate the result based on the choices
function calculateResult(userChoice: Choice, computerChoice: Choice): GameResult {
  if (userChoice === computerChoice) return 'Tie';
  
  if (userChoice === 'rock') {
    return computerChoice === 'scissors' ? 'Win' : 'Loss';
  }
  if (userChoice === 'paper') {
    return computerChoice === 'rock' ? 'Win' : 'Loss';
  }
  if (userChoice === 'scissors') {
    return computerChoice === 'paper' ? 'Win' : 'Loss';
  }
  return 'Tie';
}

export default function PlayPage() {
  const { publicKey } = useWallet();
  const [result, setResult] = useState<GameResult | ''>('');
  const [balance, setBalance] = useState(0.000023);
  const [selectedChoice, setSelectedChoice] = useState<Choice | ''>('');
  const [computerChoice, setComputerChoice] = useState<Choice | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const handlePlay = async (choice: Choice) => {
    setSelectedChoice(choice);
    setIsLoading(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Computer randomly chooses one of the options
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(compChoice);
    
    // Calculate result based on game rules
    const computedResult = calculateResult(choice, compChoice);
    setResult(computedResult);
    setIsLoading(false);
    
    // Update balance locally:
    // For example, if win, add 0.000001 SOL, if loss subtract 0.000001 SOL, tie does nothing.
    if (computedResult === 'Win') {
      setBalance(prev => prev + 0.000001);
    } else if (computedResult === 'Loss') {
      setBalance(prev => prev - 0.000001);
    }
    
    // Post the game result to the API so the database gets updated.
    if (publicKey) {
      const payload = {
        publicKey: publicKey.toString(),
        result: computedResult,
        amount: computedResult === 'Win' ? 0.000001 : (computedResult === 'Loss' ? -0.000001 : 0),
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
    }
  };

  const resetGame = () => {
    setResult('');
    setSelectedChoice('');
    setComputerChoice('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Animated Heading Display */}
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

      {/* Game Container */}
      <div className="border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
        {/* Dynamic Choice Grid */}
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

        {/* Battle Arena */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-full h-full bg-gradient-radial from-cyan-500/5 to-transparent animate-pulse" />
          </div>
          
          <div className="flex items-center justify-center gap-8 relative z-10">
            {/* Player Choice */}
            <AnimatePresence>
              {selectedChoice && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center mt-10"
                >
                  <div className="text-sm text-cyan-300 mb-2 font-medium">Your Move</div>
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${
                    selectedChoice === 'rock' ? 'from-red-500/30 to-red-700/20' :
                    selectedChoice === 'paper' ? 'from-blue-500/30 to-blue-700/20' :
                    'from-green-500/30 to-green-700/20'
                  } shadow-xl`}>
                    {selectedChoice === 'rock' && <FaHandRock className="text-6xl text-red-400" />}
                    {selectedChoice === 'paper' && <FaHandPaper className="text-6xl text-blue-400" />}
                    {selectedChoice === 'scissors' && <FaHandScissors className="text-6xl text-green-400" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VS Separator */}
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

            {/* Computer Choice */}
            <AnimatePresence>
              {computerChoice && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-center mt-10"
                >
                  <div className="text-sm text-purple-300 mb-2 font-medium">Computer</div>
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${
                    computerChoice === 'rock' ? 'from-red-500/30 to-red-700/20' :
                    computerChoice === 'paper' ? 'from-blue-500/30 to-blue-700/20' :
                    'from-green-500/30 to-green-700/20'
                  } shadow-xl`}>
                    {computerChoice === 'rock' && <FaHandRock className="text-6xl text-red-400" />}
                    {computerChoice === 'paper' && <FaHandPaper className="text-6xl text-blue-400" />}
                    {computerChoice === 'scissors' && <FaHandScissors className="text-6xl text-green-400" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
            >
              <div className="inline-flex flex-col items-center gap-3 text-cyan-400">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
                <div className="font-medium tracking-widest text-sm">ANALYZING MOVES...</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-center"
            >
              <div className={`mt-10 p-8 rounded-2xl backdrop-blur-lg ${
                result === 'Win' ? 'bg-gradient-to-br from-green-900/30 to-cyan-900/30' :
                result === 'Loss' ? 'bg-gradient-to-br from-red-900/30 to-rose-900/30' :
                'bg-gradient-to-br from-slate-900/30 to-slate-800/30'
              } shadow-2xl`}>
                <h3 className="text-2xl font-bold text-slate-100 mb-4">
                  {result === 'Win' && '🏆 Victory!'}
                  {result === 'Loss' && '💥 Defeat'}
                  {result === 'Tie' && '🤝 Draw'}
                </h3>
                
                <div className="mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    result === 'Win' ? 'bg-green-500/20 text-green-300' :
                    result === 'Loss' ? 'bg-red-500/20 text-red-300' :
                    'bg-slate-600/20 text-slate-300'
                  }`}>
                    {result === 'Win' && '+0.000001 SOL'}
                    {result === 'Loss' && 'Better luck next time!'}
                    {result === 'Tie' && 'Try again!'}
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
    </div>
  );
}
