'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false); // <-- Client-side guard
  const { isAuthenticated, logout, setUser, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Ensure client-side mount
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

  const handleLogoutBtn = () => {
    logout();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newUser = {
        ...user,
        username,
        email,
        password,
      };
      setUser(newUser);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isMounted || !isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className='w-1/4 min-h-full bg-white px-8 py-16 rounded-3xl shadow-lg flex flex-col items-center mt-36 shdaow-custom'>
      <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text'>Your Profile</h1>
      {message && (
        <div className='bg-green-500 px-5 py-2 rounded-md mb-4'>
          <p className='text-green-800'>{message}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='px-7 py-3 my-2 border rounded-lg' placeholder='Username' />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='px-7 py-3 my-2 border rounded-lg' placeholder='Email' />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='px-7 py-3 my-2 border rounded-lg' placeholder='Password' />
        <div className='flex gap-6'>
          <motion.button
            className="cursor-pointer mt-5 w-2/3 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 transition duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            Save
          </motion.button>
          <motion.button
            type="button"
            className="cursor-pointer mt-5 w-2/3 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 transition duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
          >
            Cancel
          </motion.button>
        </div>
      </form>
      <button
        onClick={handleLogoutBtn}
        className="cursor-pointer mt-6 px-6 py-2 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
