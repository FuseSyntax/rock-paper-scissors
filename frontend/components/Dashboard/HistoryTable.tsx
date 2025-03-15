import { motion } from 'framer-motion';
import { useState } from 'react';

interface GameHistory {
  date: string;
  result: 'Win' | 'Loss' | 'Tie';
  yourChoice: string;
  computerChoice: string;
  amount: number;
}

export const HistoryTable = ({ data }: { data: GameHistory[] }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="border border-slate-800/50 rounded-xl bg-slate-900/20 p-6 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              {['Date', 'Result', 'Your Choice', 'Computer', 'Amount'].map((header, i) => (
                <th 
                  key={header}
                  className={`px-4 py-3 text-left text-slate-400 ${
                    i === 0 ? 'rounded-tl-xl' : i === 4 ? 'rounded-tr-xl' : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/20 transition-colors"
              >
                <td className="px-4 py-3 text-slate-300">{item.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-sm ${
                    item.result === 'Win' ? 'bg-teal-600/20 text-teal-400' :
                    item.result === 'Loss' ? 'bg-rose-600/20 text-rose-400' : 
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {item.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 capitalize">{item.yourChoice}</td>
                <td className="px-4 py-3 text-slate-400 capitalize">{item.computerChoice}</td>
                <td className="px-4 py-3 text-cyan-400 font-mono">{item.amount.toFixed(6)} SOL</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-800 rounded-md text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-800 rounded-md text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
