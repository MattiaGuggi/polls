import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen text-gray-800 p-6">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-5xl font-bold mb-2 text-white">404</h1>
      <p className="text-xl mb-6 text-white">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/"
        className="cursor-pointer mt-5 w-1/6 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
        hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900
        hover:scale-110 transition duration-200"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
