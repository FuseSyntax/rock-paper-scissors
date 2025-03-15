import { useWallet } from '@solana/wallet-adapter-react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { HistoryTable } from '../components/Dashboard/HistoryTable';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiAward, FiCalendar, FiCopy } from 'react-icons/fi';
import { useState } from 'react';
import Jazzicon from 'react-jazzicon';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const generatePlayerName = (publicKey: string | null) => {
  if (!publicKey) return 'Unknown Player';
  // Ensure the public key is a string and slice it safely
  const hash = parseInt(publicKey.slice(-6), 16); // Convert last 6 chars to a number
  const names = ['Shadow', 'CryptoWarrior', 'NeonKnight', 'Specter', 'Stormrider', 'Phantom'];
  return `${names[hash % names.length]} #${publicKey.slice(0, 4)}`;
};

const ProfileCard = ({ publicKey, stats }) => {
  const accountAge = stats?.createdAt
    ? Math.floor((Date.now() - new Date(stats.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const publicKeyStr = publicKey?.toString() || ''; // Convert publicKey to string safely

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-slate-800/50 rounded-2xl bg-slate-900/20 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4 mb-6">
        {/* Jazzicon Avatar with publicKeyStr */}
        <Jazzicon diameter={60} seed={parseInt(publicKeyStr.slice(0, 8), 16) || 12345} />

        <div>
          <h2 className="text-xl font-bold text-slate-300">{generatePlayerName(publicKeyStr)}</h2>
          <p className="text-slate-400 text-sm">Since {accountAge} days</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
          <span className="text-slate-400">Public Key</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 font-mono truncate max-w-[120px]">
              {publicKeyStr.slice(0, 4)}...{publicKeyStr.slice(-4)}
            </span>
            <CopyToClipboard text={publicKeyStr}>
              <button className="text-slate-400 hover:text-cyan-400 transition-colors">
                <FiCopy className="w-4 h-4 cursor-pointer" />
              </button>
            </CopyToClipboard>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Games Played</div>
            <div className="text-xl font-bold text-cyan-400">
              {(stats?.wins || 0) + (stats?.losses || 0) + (stats?.ties || 0)}
            </div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Win Rate</div>
            <div className="text-xl font-bold text-cyan-400">
              {stats?.wins ? ((stats.wins / ((stats.wins + stats.losses) || 1)) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};




export default function Dashboard() {
  const { publicKey } = useWallet();
  const publicKeyString = publicKey?.toString();

  // Using SWR's mutate function to revalidate data
  const { data: stats, mutate: mutateStats } = useSWR(
    publicKeyString ? `/api/users/${publicKeyString}` : null,
    fetcher
  );
  const { data: history } = useSWR(
    publicKeyString ? `/api/history?publicKey=${publicKeyString}` : null,
    fetcher
  );

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!publicKeyString) return;
    setIsWithdrawing(true);
    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: publicKeyString }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Withdrawal successful! Transaction: ' + data.txSignature);
        
        // Optimistically update the balance to 0 before refetching
        mutateStats((prevStats) => ({ ...prevStats, balance: 0 }), false);
  
        // Revalidate data from API
        mutateStats();
      } else {
        alert('Withdrawal failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Error withdrawing funds.');
    }
    setIsWithdrawing(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileCard publicKey={publicKey} stats={stats} />
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard 
            title="Total Wins" 
            value={stats?.wins || 0} 
            icon={<FiAward className="w-6 h-6" />}
            color="from-green-600/20 to-emerald-600/20"
          />
          <StatsCard 
            title="Total Losses" 
            value={stats?.losses || 0}
            icon={<FiAward className="w-6 h-6" />}
            color="from-red-600/20 to-rose-600/20"
          />
          <StatsCard 
            title="Total Ties" 
            value={stats?.ties || 0}
            icon={<FiAward className="w-6 h-6" />}
            color="from-slate-600/20 to-slate-700/20"
          />
          <StatsCard 
            title="Balance" 
            value={`${stats?.balance?.toFixed(6) || 0} SOL`}
            icon={<FiCalendar className="w-6 h-6" />}
            color="from-cyan-600/20 to-teal-600/20"
          />
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="flex justify-center">
        <button 
          onClick={handleWithdraw}
          disabled={isWithdrawing || !stats || stats.balance <= 0}
          className="px-6 py-3 cursor-pointer bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-colors"
        >
          {isWithdrawing ? 'Withdrawing...' : 'Withdraw Balance'}
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border border-slate-800/50 rounded-2xl bg-slate-900/20 p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-bold text-slate-300 mb-6">Game History</h2>
        {history && history.length > 0 ? (
          <HistoryTable data={history} />
        ) : (
          <p className="text-slate-400">No games played yet.</p>
        )}
      </motion.div>
    </div>
  );
}
