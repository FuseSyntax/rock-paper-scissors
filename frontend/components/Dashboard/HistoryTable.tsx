import { motion } from 'framer-motion';

interface GameHistory {
  date: string;
  result: 'Win' | 'Loss' | 'Tie';
  yourChoice: string;
  computerChoice: string;
  amount: number;
}

export const HistoryTable = ({ data }: { data: GameHistory[] }) => {
  return (
    <div className="border border-slate-800/50 rounded-xl bg-slate-900/20 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-slate-300 mb-6">Game History</h2>
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
            {data.map((item, index) => (
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
    </div>
  );
};