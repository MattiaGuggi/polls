import React from 'react';
import { notFound } from 'next/navigation';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { pollType } from '@/lib/types';

interface PollPageProps {
  params: Promise<{ id: string }>;
}

const PollPage = async ({ params }: PollPageProps) => {
  const { id } = await params;
  let poll: pollType | null = null;

  try {
    const baseUrl = process.env.CLIENT_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/polls/get-all`, { cache: 'no-store' });

    if (!response.ok) throw new Error('Failed to fetch poll');

    const data = await response.json();
    const polls: pollType[] = data.polls || [];

    poll = polls.find((p) => String(p._id) === String(id)) || null;
  } catch (error) {
    console.error('Error fetching poll:', error);
  }

  if (!poll) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" style={{ filter: 'blur(120px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200" style={{ filter: 'blur(120px)' }} />
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto p-8">
        <Link href="/poll" className="self-start mb-4 text-white cursor-pointer duration-200 transition-all hover:scale-125">
          <MoveLeft />
        </Link>
        <h1 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">Poll Page</h1>
        <p className="text-lg text-indigo-200 mb-6">
          Object ID: <span className="font-mono text-green-300">{id}</span>
        </p>
        <Link
          href={`/poll/${id}/play`}
          className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 hover:scale-105 text-center block"
        >
          Play
        </Link>
      </div>
    </div>
  );
};

export default PollPage;