'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import ProfileModal from '../../components/ProfileModal';
import Loading from '../../../app/loading';
import Poll from '../../components/Poll';

const Profile = () => {
  const [polls, setPolls] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        username,
        email,
        password,
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
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setPassword(user.password || '');
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
        <ProfileModal message={message} setMessage={setMessage} username={username} email={email} password={password} handleSubmit={handleSubmit}
          setUsername={setUsername} setEmail={setEmail} setPassword={setPassword} setIsOpen={setIsOpen}
        />
      ) : (
        <>
          <div className='flex flex-col py-4 px-9 items-center'>
            <h1 className='text-2xl font-bold text-white'>{username}</h1>
            { isLoading ? (
              <Loading />
            ) : (
              <>
                <h1 className='text-xl font-bold text-white my-10'>Your created polls</h1>
                <div className='grid grid-cols-4 gap-4 my-5'>
                  {polls.map((poll, idx) => (
                    <Poll key={idx} poll={poll} mode='edit' />
                  ))}
                </div>
              </>
            )}
            <button
              className='cursor-pointer mt-5 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
              hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition duration-200 w-1/5'
              onClick={() => setIsOpen(prev => !prev)}
            >
              Modify
            </button>
          </div>
          <button
              onClick={logout}
              className="cursor-pointer mt-6 px-6 py-2 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200
              hover:scale-110"
          >
              Logout
          </button>
        </>
      )}
    </>
  );
};

export default Profile;
