import { useState } from 'react';
import { motion } from 'framer-motion';
import { playGame } from '../../utils/gameLogic';

const choices = ['rock', 'paper', 'scissors'] as const;

export default function GameBoard() {
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');

  const handlePlay = async (choice: Choice) => {
    setUserChoice(choice);
    const gameResult = await playGame(choice); // Integrates with Solana backend
    setResult(gameResult);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {choices.map((choice) => (
          <motion.button
            key={choice}
            whileHover={{ scale: 1.1 }}
            className="bg-gray-700 p-4 rounded-lg"
            onClick={() => handlePlay(choice)}
          >
            {choice.toUpperCase()}
          </motion.button>
        ))}
      </div>
      {result && (
        <motion.div animate={{ scale: 1 }} className="text-center">
          <p className="text-xl mb-4">Result: {result}</p>
          <button 
            className="bg-blue-600 px-6 py-2 rounded-lg"
            onClick={() => setResult('')}
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}