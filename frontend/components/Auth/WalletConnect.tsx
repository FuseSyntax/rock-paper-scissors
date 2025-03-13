import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

export const WalletConnectButton = () => {
  const { connected, publicKey } = useWallet();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <WalletModalProvider>
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-lg !px-4 !py-2 !text-sm !font-medium !transition-colors">
          {connected ? (
            <span className="truncate max-w-[120px]">
              {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
            </span>
          ) : (
            'Connect Wallet'
          )}
        </WalletMultiButton>
      </WalletModalProvider>
    </motion.div>
  );
};