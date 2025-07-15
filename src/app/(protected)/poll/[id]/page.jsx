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
    <>
      <Link href='/poll' className='cursor-pointer duration-400 transition-all hover:scale-125'><MoveLeft /></Link>
      <h1 className="text-2xl font-bold text-white mb-4">Poll Page</h1>
      <p className="text-gray-300 mb-6">Object ID: <span className="font-mono text-green-300">{id}</span></p>
      <Link href={`/poll/${id}/play`} className="cursor-pointer mt-5 w-1/6 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
        hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900
        transition duration-200 hover:scale-110"
      >
        Play
      </Link>
    </>
  )
}
