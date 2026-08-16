'use client';

import ProtectedLayout from "./(protected)/layout";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';
import AnimatedContent from "./components/AnimatedContent";
import { Vote, ArrowRight, Sparkles } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-4 py-12">
      <ProtectedLayout>
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
          <AnimatedContent
            distance={350}
            direction="vertical"
            reverse={true}
            duration={0.6}
            ease="bounce.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            delay={0.5}
          >
            {/* Glass Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md text-indigo-300 text-xs sm:text-sm font-medium mb-6 shadow-inner">
              <Sparkles className="size-4 text-indigo-400 animate-pulse" />
              <span>Next-Gen Interactive Polling Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-400 to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
                My Next App
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              Manage your polls, engage participants, and track real-time results with a streamlined, modern interface designed for speed.
            </p>
          </AnimatedContent>

          <div className="w-full max-w-xs mx-auto">
            <button
              className="group relative cursor-pointer w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base flex items-center justify-center gap-2 border border-indigo-400/30"
              type="submit"
              onClick={() => router.push(`/poll`)}
            >
              <Vote className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
              <span>View all polls</span>
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </ProtectedLayout>
    </div>
  );
};

export default Home;