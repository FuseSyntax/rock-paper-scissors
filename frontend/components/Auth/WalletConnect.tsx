//component/Auth/WalletConnect.tsx
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ className }) => {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Wait until client mount to avoid SSR mismatches
  useEffect(() => {
    setMounted(true);
    const createUser = async () => {
      if (connected && publicKey) {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicKey: publicKey.toString() })
        });
        console.log('createUser response status:', res.status);
      }
    };
    createUser();
  }, [connected, publicKey]);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={className}
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
