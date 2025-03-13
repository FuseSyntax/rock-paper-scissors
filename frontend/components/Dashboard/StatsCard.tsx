import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  color?: string;
}

export const StatsCard = ({ title, value, color = 'from-cyan-600/20 to-teal-600/20' }: StatsCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-px rounded-xl bg-gradient-to-br ${color}`}
    >
      <div className="p-6 bg-slate-900 rounded-xl h-full">
        <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-slate-300">{value}</p>
      </div>
    </motion.div>
  );
};