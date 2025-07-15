'use client';
import ProtectedLayout from "./(protected)/layout";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';
import AnimatedContent from "./components/AnimatedContent";

const Home = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <ProtectedLayout>
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
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 to-indigo-700 bg-clip-text text-transparent">My Next App</span>
          </h1>
          <p className="text-lg md:text-2xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Manage your polls, participants, and more with a beautiful and modern interface.
          </p>
        </AnimatedContent>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <button
            className="cursor-pointer mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg
            shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900
            transition duration-200 hover:scale-110 text-lg"
            type="submit"
            onClick={() => router.push(`/poll`)}
          >
            View all polls
          </button>
        </div>
      </ProtectedLayout>
    </div>
  );
}

export default Home;
