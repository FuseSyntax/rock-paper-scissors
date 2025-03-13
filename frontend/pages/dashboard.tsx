import { StatsCard } from '../components/Dashboard/StatsCard';
import { HistoryTable } from '../components/Dashboard/HistoryTable';

const mockHistory = [
  { date: '2023-08-01', result: 'Win', yourChoice: 'rock', computerChoice: 'scissors', amount: 0.000002 },
  { date: '2023-08-01', result: 'Loss', yourChoice: 'paper', computerChoice: 'scissors', amount: 0.000001 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Wins" value="12" color="from-teal-600/20 to-cyan-600/20" />
        <StatsCard title="Total Losses" value="8" color="from-rose-600/20 to-pink-600/20" />
        <StatsCard title="Total Ties" value="3" color="from-slate-600/20 to-slate-700/20" />
        <StatsCard title="Balance" value="0.000023 SOL" color="from-cyan-600/20 to-teal-600/20" />
      </div>
      
      <HistoryTable data={mockHistory} />
    </div>
  );
}