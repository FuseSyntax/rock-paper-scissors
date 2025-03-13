import { motion } from 'framer-motion';
import { WalletConnectButton } from '../components/Auth/WalletConnect';
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa';
import Link from 'next/link';

const MotionStep = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20%" }}
    transition={{ delay, duration: 0.4 }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container max-w-6xl px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 leading-tight">
              Decentralized RPS
              <span className="block text-3xl mt-4 font-normal text-slate-400">Provably Fair On-Chain Battles</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto mb-8"
            >
              Engage in trustless rock-paper-scissors matches powered by Solana. 
              Compete globally, win SOL, and ascend the leaderboards.
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-gradient-to-r from-teal-600/30 to-cyan-600/30 backdrop-blur-sm p-px rounded-lg"
            >
              <div className="bg-slate-900/80 rounded-lg">
                <WalletConnectButton className="px-8 py-3 text-lg font-medium hover:bg-slate-800/50 transition-colors" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-24 flex justify-center gap-12 text-6xl text-cyan-400/40"
          >
            <FaHandRock className="hover:text-cyan-400 transition-colors cursor-pointer" />
            <FaHandPaper className="hover:text-cyan-400 transition-colors cursor-pointer" />
            <FaHandScissors className="hover:text-cyan-400 transition-colors cursor-pointer" />
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="container max-w-6xl px-4 mx-auto">
          <MotionStep delay={0.1}>
            <h2 className="text-3xl font-bold text-center mb-16 text-slate-300">
              Why Play Here?
            </h2>
          </MotionStep>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Instant Settlements",
                content: "Matches resolve in under 400ms using Solana's high-speed network",
                color: "from-teal-600/20 to-cyan-600/20"
              },
              { 
                title: "Zero Trust",
                content: "Fully on-chain logic with verifiable randomness",
                color: "from-teal-600/20 to-cyan-600/20"
              },
              { 
                title: "Competitive Ladders",
                content: "Global leaderboards with seasonal rewards",
                color: "from-teal-600/20 to-cyan-600/20"
              }
            ].map((item, i) => (
              <MotionStep key={item.title} delay={0.2 + i * 0.1}>
                <div className={`p-px rounded-xl bg-gradient-to-br ${item.color}`}>
                  <div className="p-8 bg-slate-900 rounded-xl h-full">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-400">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </MotionStep>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "432K", label: "Daily Matches" },
              { value: "98.7%", label: "Uptime" },
              { value: "3.2s", label: "Avg. Match Time" },
              { value: "16.8K", label: "Active Players" }
            ].map((stat, i) => (
              <MotionStep key={stat.label} delay={0.1 + i * 0.05}>
                <div className="p-6 text-center border border-slate-800/50 rounded-xl bg-slate-900/20">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </MotionStep>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="container max-w-6xl px-4 mx-auto text-center">
          <MotionStep delay={0.1}>
            <h2 className="text-3xl font-bold mb-8 text-slate-300">
              Ready to Compete?
            </h2>
          </MotionStep>
          
          <MotionStep delay={0.2}>
            <Link href={"/play"}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg font-medium text-lg shadow-xl shadow-cyan-900/20 hover:shadow-cyan-900/30 transition-all"
            >
              Start Playing
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </MotionStep>
        </div>
      </section>
    </div>
  );
}