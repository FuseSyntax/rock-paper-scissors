import { motion } from 'framer-motion';

interface ChoiceButtonProps {
  choice: 'rock' | 'paper' | 'scissors';
  onClick: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  icon: React.ReactNode;
  color: string; // Made required
}

export const ChoiceButton = ({ 
  choice, 
  onClick, 
  disabled, 
  isSelected,
  icon,
  color 
}: ChoiceButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-6 rounded-xl font-bold text-xl transition-all 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isSelected ? `bg-slate-900/50 border-2 ${color}` : 'bg-slate-900/20'}
      `}
    >
      <div className={`${color} flex flex-col items-center gap-2`}>
        {icon}
        <span className="text-sm font-medium capitalize">{choice}</span>
      </div>
    </motion.button>
  );
};