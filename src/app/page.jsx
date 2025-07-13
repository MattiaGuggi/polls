'use client';
import ProtectedLayout from "./(protected)/layout";
import { motion } from 'framer-motion';
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
    <ProtectedLayout>
      <AnimatedContent
        distance={470}
        direction="vertical"
        reverse={true}
        duration={0.6}
        ease="bounce.out"
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
        delay={0.1}
      >
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to My Next App</h1>
      </AnimatedContent>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.button
        className="cursor-pointer mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        onClick={() => router.push(`/poll`)}
        >View all polls</motion.button>
      </div>
    </ProtectedLayout>
  );
}

export default Home;
