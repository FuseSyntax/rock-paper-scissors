import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { FiGithub, FiMenu, FiX } from 'react-icons/fi';
import { WalletConnectButton } from './Auth/WalletConnect';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <ToastContainer />
      <nav className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent flex items-center space-x-2"
              >
                🎮 RPS Arena
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <NavLink href="/play" text="Play" />
                <NavLink href="/dashboard" text="Dashboard" />
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <motion.a
                  href="https://github.com/nitindahiya-dev/rock-paper-scissors"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <FiGithub className="w-6 h-6 text-slate-300 hover:text-cyan-400" />
                </motion.a>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-teal-600/30 to-cyan-600/30 backdrop-blur-sm p-px rounded-lg"
                >
                  <div className="bg-slate-900/80 rounded-lg">
                    <WalletConnectButton className="hover:bg-slate-800/50 px-4 py-2" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800/50"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute w-full bg-slate-900/95 backdrop-blur-lg border-b border-slate-800/50"
          >
            <div className="px-4 py-4 space-y-4">
              <MobileNavLink href="/play" text="Play" toggleMenu={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/dashboard" text="Dashboard" toggleMenu={() => setIsMenuOpen(false)} />
              
              <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <WalletConnectButton className="w-full mr-2" />
                <motion.a
                  href="https://github.com/nitindahiya-dev/rock-paper-scissors"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="p-2 rounded-lg hover:bg-slate-800/50"
                >
                  <FiGithub className="w-6 h-6 text-slate-300 hover:text-cyan-400" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </nav>


      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]"
      >
        {children}
      </motion.main>

      <footer className="border-t border-slate-800/50 mt-2">
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


// Reusable NavLink component
const NavLink = ({ href, text }: { href: string; text: string }) => (
  <Link href={href}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative text-slate-300 hover:text-cyan-400 transition-colors duration-200 font-medium group"
    >
      {text}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 transition-all group-hover:w-full" />
    </motion.div>
  </Link>
);

// Mobile NavLink component
const MobileNavLink = ({ href, text, toggleMenu }: { href: string; text: string; toggleMenu: () => void }) => (
  <Link href={href} onClick={toggleMenu}>
    <div className="text-slate-300 hover:text-cyan-400 px-4 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
      {text}
    </div>
  </Link>
);
