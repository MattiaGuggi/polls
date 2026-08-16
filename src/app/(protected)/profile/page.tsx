'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactDOM from 'react-dom';
import { useUser } from '@/app/context/UserContext';
import ProfileModal from '@/app/components/ProfileModal';
import Loading from '@/app/loading';
import Poll from '@/app/components/Poll';
import { pollType, userType } from '@/lib/types';

const Profile = () => {
  const pollsContainer = useRef<HTMLDivElement>(null);
  const [polls, setPolls] = useState<pollType[]>([]);
  const [currentUser, setCurrentUser] = useState<userType | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isAuthenticated, logout, setUser, user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !user) return;
    try {
      const newUser = {
        ...user,
        _id: user._id,
        username: currentUser.username,
        email: currentUser.email,
        password: currentUser.password,
      };

      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      setUser(newUser);
      setMessage(data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getPolls = useCallback(async () => {
    if (!user?._id) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/polls/get-all`);
      if (!response.ok) throw new Error('Failed to fetch polls');

      const data = await response.json();
      const userPolls = (data.polls || []).filter((poll: pollType) => poll.creator === user._id);

      setPolls(userPolls);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        getPolls();
      }
    }
  }, [isMounted, isAuthenticated, router, getPolls]);

  useEffect(() => {
    if (user && user.username && user.email) {
      setCurrentUser({
        username: user.username,
        email: user.email,
        password: user.password || '',
      });
    }
  }, [user]);

  if (!isMounted || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-10">
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ filter: 'blur(120px)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200"
        style={{ filter: 'blur(120px)' }}
      />

      {isOpen && typeof window !== 'undefined' ? (
        ReactDOM.createPortal(
          <div className="fixed inset-0 h-screen w-screen bg-black/70 flex items-center justify-center z-[9999]">
            <ProfileModal
              message={message}
              setMessage={setMessage}
              currentUser={currentUser}
              handleSubmit={handleSubmit}
              setCurrentUser={setCurrentUser}
              setIsOpen={setIsOpen}
            />
          </div>,
          document.body
        )
      ) : (
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto p-8">
          <h1 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">
            {currentUser?.username}
          </h1>

          {isLoading ? (
            <Loading />
          ) : (
            <div ref={pollsContainer} className="w-full">
              <h2 className="text-xl font-bold text-white my-10 text-center">Your created polls</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-5">
                {polls.map((poll, idx) => (
                  <div className="poll-card" key={poll._id || idx}>
                    <Poll poll={poll} mode="edit" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="cursor-pointer mt-5 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 hover:scale-105 transition duration-200 w-full max-w-xs"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Modify
          </button>
          <button
            onClick={logout}
            className="cursor-pointer mt-6 px-6 py-2 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-105 w-full max-w-xs"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;