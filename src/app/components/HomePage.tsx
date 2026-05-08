import { TrendingUp, Plus, Send, Sparkles } from 'lucide-react';
import { UserStats, AIInsight } from '../types';
import { motion } from 'motion/react';
import { ColorTheme } from '../data/themes';

interface HomePageProps {
  userStats: UserStats;
  topInsight: AIInsight;
  onOpenDeposit?: () => void;
  theme: ColorTheme;
}

export function HomePage({ userStats, topInsight, onOpenDeposit, theme }: HomePageProps) {
  const mainBalance = userStats.totalSavings;

  return (
    <div className="min-h-screen bg-[#071623] text-slate-100 pb-28">
      <div className="px-5 pt-10 pb-6">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total balance</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">RM {mainBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            <p className="mt-2 text-sm text-slate-400 inline-flex items-center gap-2">
              <span>Balance info</span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">›</span>
            </p>
          </div>

        </div>

        <motion.div
          className="mt-6 rounded-[2rem] border border-white/10 bg-black p-5 shadow-2xl relative overflow-hidden cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onClick={() => {
            const video = document.querySelector('#animal-video') as HTMLVideoElement;
            if (video) {
              if (video.paused) {
                video.play();
              } else {
                video.pause();
              }
            }
          }}
        >
          <img
            src="/img/grasspix.jpg"
            alt="Grass landscape"
            className="w-full h-full object-cover rounded-xl"
          />
          <video
            id="animal-video"
            className="absolute bottom-2 right-6 w-20 h-20 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity duration-300 border border-white/20 shadow-lg"
            loop
            muted
            playsInline
          >
            <source src="/img/Cat.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        <motion.div
          className="mt-5 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            onClick={onOpenDeposit}
            className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-5 text-center transition hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold">Deposit</p>
          </button>

          <button
            onClick={() => undefined}
            className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-5 text-center transition hover:border-white/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Send className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold">Send Money</p>
          </button>
        </motion.div>
      </div>

      <div className="px-5 space-y-4">
        <motion.div
          className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Your everyday account</p>
              <h2 className="mt-3 text-xl font-semibold text-white">My main balance</h2>
            </div>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-[1.75rem] bg-slate-950/70 p-5 shadow-lg border border-white/10">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Main account</p>
              <p className="mt-4 text-3xl font-semibold text-white">RM {mainBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="mt-2 text-sm text-slate-400">Available balance</p>
              <button
                onClick={() => undefined}
                className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                View transactions
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950/70 p-5 shadow-lg border border-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Savings Pockets</p>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300">
                  2.00% p.a.
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">Earn 2.00% p.a. Withdraw anytime.</p>
              <button
                onClick={() => undefined}
                className="mt-6 inline-flex items-center justify-center rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Create
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
