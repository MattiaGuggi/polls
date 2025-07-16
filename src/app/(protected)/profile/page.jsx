'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactDOM from 'react-dom';
import { useUser } from '../../context/UserContext';
import ProfileModal from '../../components/ProfileModal';
import Loading from '../../../app/loading';
import Poll from '../../components/Poll';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Profile = () => {
  const pollsContainer = useRef();
  const [polls, setPolls] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false); // <-- Client-side guard
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, logout, setUser, user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      setUser(newUser);
      setMessage(data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getPolls = async () => {
    try {
      const response = await fetch(`/api/polls/get-all`);

      if (!response.ok) throw new Error('Failed to fetch polls');

      const data = await response.json();
      const userPolls = data.polls.filter(poll => poll.creator === user._id);

      setPolls(userPolls);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true); // Ensure client-side mount
    getPolls();
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  useEffect(() => {
    if (user && user.username && user.email) {
      setCurrentUser({
        username: user.username,
        email: user.email,
        password: user.password || ''
      });
    }
  }, [user]);

  if (!isMounted || !isAuthenticated) {
    return (
      <Loading />
    );
  }

  return (
    <>
      {isOpen ? (
        ReactDOM.createPortal(
          <div className="fixed inset-0 h-screen w-screen bg-black/70 flex items-center justify-center z-[9999]">
            <ProfileModal message={message} setMessage={setMessage} currentUser={currentUser} handleSubmit={handleSubmit}
              setCurrentUser={setCurrentUser} setIsOpen={setIsOpen} />
          </div>, document.body
        )
      ) : (
        <>
          <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-10">
            {/* Decorative blurred background shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" style={{ filter: 'blur(120px)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200" style={{ filter: 'blur(120px)' }} />
            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto p-8">
              <h1 className='text-3xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight'>{currentUser.username}</h1>
              { isLoading ? (
                <Loading />
              ) : (
                <div ref={pollsContainer}>
                  <h1 className='text-xl font-bold text-white my-10'>Your created polls</h1>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-5'>
                    {polls.map((poll, idx) => (
                      <div className="poll-card" key={idx}>
                        <Poll poll={poll} mode='edit' />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                className='cursor-pointer mt-5 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
                hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition duration-200 w-full max-w-xs'
                onClick={() => setIsOpen(prev => !prev)}
              >
                Modify
              </button>
              <button
                  onClick={logout}
                  className="cursor-pointer mt-6 px-6 py-2 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200
                  hover:scale-110 w-full max-w-xs"
              >
                  Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
