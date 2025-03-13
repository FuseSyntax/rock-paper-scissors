import { motion } from 'framer-motion';
import { WalletConnectButton } from './Auth/WalletConnect';
import Link from 'next/link';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <nav className="border-b border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"
                >
                  RPS Arena
                </motion.div>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  href="/play" 
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
                >
                  Play
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-teal-600/30 to-cyan-600/30 backdrop-blur-sm p-px rounded-lg"
            >
              <div className="bg-slate-900/80 rounded-lg">
                <WalletConnectButton className="hover:bg-slate-800/50 transition-colors" />
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>

      <footer className="border-t border-slate-800/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} RPS Arena. All rights reserved.
            <span className="mx-2">•</span>
            <a 
              href="#"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};