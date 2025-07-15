import React from 'react'
import { notFound } from 'next/navigation'
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default async function pollPage ({ params }) {
  const { id } = await params;
  let poll = null;

  try {
    const response = await fetch(`${process.env.CLIENT_URL}/api/polls/get-all`);

    if (!response.ok) throw new Error('Failed to fetch poll');

    const data = await response.json();
    const polls = data.polls || [];

    poll = polls.find(p => p._id == id);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return null;
  }

  if (!poll) return notFound();

  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-10">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" style={{ filter: 'blur(120px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200" style={{ filter: 'blur(120px)' }} />
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto p-8">
        <Link href='/poll' className='self-start mb-4 text-white cursor-pointer duration-400 transition-all hover:scale-125'><MoveLeft /></Link>
        <h1 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">Poll Page</h1>
        <p className="text-lg text-indigo-200 mb-6">Object ID: <span className="font-mono text-green-300">{id}</span></p>
        <Link href={`/poll/${id}/play`} className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
          hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900
          transition duration-200 hover:scale-110 text-center block"
        >
          Play
        </Link>
      </div>
    </div>
  )
}
