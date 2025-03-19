import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout';
import '../styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';



const App = ({ Component, pageProps }: AppProps) => {
  const endpoint = "https://api.devnet.solana.com/";
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;