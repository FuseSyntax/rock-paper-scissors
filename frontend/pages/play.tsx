import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoiceButton } from '../components/Game/ChoiceButton';
import { 
  FaHandRock, 
  FaHandPaper, 
  FaHandScissors,
  FaRedo
} from 'react-icons/fa';

export default function PlayPage() {
  const [result, setResult] = useState('');
  const [balance, setBalance] = useState(0.000023);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const choices = ['rock', 'paper', 'scissors'];

  const handlePlay = async (choice: string) => {
    setSelectedChoice(choice);
    setIsLoading(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const computer = choices[Math.floor(Math.random() * 3)];
    setComputerChoice(computer);
    
    const results = ['Win', 'Loss', 'Tie'];
    const randomResult = results[Math.floor(Math.random() * 3)];
    setResult(randomResult);
    setIsLoading(false);
    
    // Update balance
    if (randomResult === 'Win') {
      setBalance(prev => prev + 0.000001);
    }
  };

  const resetGame = () => {
    setResult('');
    setSelectedChoice('');
    setComputerChoice('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Balance Display - Keep as is */}

      <div className="border border-slate-800/50 rounded-2xl bg-slate-900/20 p-6 backdrop-blur-sm">
        {/* Choices Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {choices.map((choice) => (
            <ChoiceButton
              key={choice}
              choice={choice as 'rock' | 'paper' | 'scissors'}
              onClick={() => handlePlay(choice)}
              isSelected={selectedChoice === choice}
              disabled={isLoading || !!result}
              icon={{
                rock: <FaHandRock className="text-3xl" />,
                paper: <FaHandPaper className="text-3xl" />,
                scissors: <FaHandScissors className="text-3xl rotate-90" />
              }[choice]}
              color={{
                rock: 'text-red-400',
                paper: 'text-blue-400',
                scissors: 'text-green-400'
              }[choice]}
            />
          ))}
        </div>

        {/* Battle Arena */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-6 min-h-[200px]">
            {/* Player Choice */}
            <AnimatePresence>
              {selectedChoice && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="text-sm text-slate-400 mb-2">Your choice</div>
                  <div className={`p-4 bg-slate-900/50 rounded-xl border-2 ${
                    selectedChoice === 'rock' ? 'border-red-500/30' :
                    selectedChoice === 'paper' ? 'border-blue-500/30' :
                    'border-green-500/30'
                  }`}>
                    {selectedChoice === 'rock' && <FaHandRock className="text-4xl text-red-400" />}
                    {selectedChoice === 'paper' && <FaHandPaper className="text-4xl text-blue-400" />}
                    {selectedChoice === 'scissors' && <FaHandScissors className="text-4xl text-green-400 rotate-90" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VS Separator */}

            {/* Computer Choice */}
            <AnimatePresence>
              {computerChoice && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="text-sm text-slate-400 mb-2">Computer</div>
                  <div className={`p-4 bg-slate-900/50 rounded-xl border-2 ${
                    computerChoice === 'rock' ? 'border-red-500/30' :
                    computerChoice === 'paper' ? 'border-blue-500/30' :
                    'border-green-500/30'
                  }`}>
                    {computerChoice === 'rock' && <FaHandRock className="text-4xl text-red-400" />}
                    {computerChoice === 'paper' && <FaHandPaper className="text-4xl text-blue-400" />}
                    {computerChoice === 'scissors' && <FaHandScissors className="text-4xl text-green-400 rotate-90" />}
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
              className="text-center py-4"
            >
              <div className="inline-flex items-center gap-2 text-slate-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                Calculating result...
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
              <div className={`p-6 rounded-xl ${
                result === 'Win' ? 'bg-green-900/20 border-green-500/30' :
                result === 'Loss' ? 'bg-red-900/20 border-red-500/30' :
                'bg-slate-900/50 border-slate-500/30'
              } border backdrop-blur-sm`}>
                <h3 className="text-xl font-bold text-slate-300 mb-3">
                  {result === 'Win' && '🎉 You Won!'}
                  {result === 'Loss' && '😞 You Lost'}
                  {result === 'Tie' && '🤝 It\'s a Tie'}
                </h3>
                
                <div className="mb-4">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    result === 'Win' ? 'bg-green-500/20 text-green-400' :
                    result === 'Loss' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {result}
                  </span>
                </div>

                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <FaRedo />
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}