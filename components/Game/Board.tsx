// frontend/components/Game/Board.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

// Define our choices and derive a type from them
const choices = ['rock', 'paper', 'scissors'] as const;
type Choice = (typeof choices)[number];

export default function GameBoard() {
  // We don't use the userChoice here; it's just for demonstration.
  const [, setUserChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');

  const handlePlay = async (choice: Choice) => {
    setUserChoice(choice);
    // Simulate playing the game – replace this stub with your actual logic later.
    const gameResult = await playGame(choice);
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

/* 
   If you want to keep the parameter for type signature and future use but don't use it now,
   you can disable the no-unused-vars ESLint rule for this function:
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function playGame(_choice: Choice): Promise<string> {
  // For demonstration, we simulate a game delay and always resolve with "Win"
  return new Promise((resolve) => {
    setTimeout(() => resolve("Win"), 500);
  });
}
