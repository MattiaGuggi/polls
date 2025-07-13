'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion';
import { MoveLeft } from 'lucide-react';

const pollPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const goBack = () => {
    router.push(`/poll`);
  };

  return (
    <>
      <MoveLeft className='cursor-pointer duration-400 transition-all hover:scale-125' onClick={goBack} />
      <h1 className="text-2xl font-bold text-green-400 mb-4">Poll Page</h1>
      <p className="text-gray-300 mb-6">Object ID: <span className="font-mono text-green-300">{id}</span></p>
      <motion.button
        className="cursor-pointer mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        onClick={() => router.push(`/poll/${id}/play`)}
      >Play</motion.button>
    </>
  )
}

export default pollPage
