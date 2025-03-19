import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-px rounded-xl bg-gradient-to-br ${color}`}
    >
      <div className="p-6 bg-slate-900 rounded-xl h-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
            <p className="text-2xl font-bold text-slate-300">{value}</p>
          </div>
          <div className="text-cyan-400">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};