'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  const handleLogoutBtn = () => {
    logout();
  };

  // Optional: prevent flicker while waiting for redirect
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {

      console.log("Profile updated");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-green-400 mb-4">Your Profile</h1>
      <div className='flex flex-col items-center gap-4'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <input type="text" value={username} onChange={() => setUsername(e.target.value)} />
          <input type="email" value={email} onChange={() => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={() => setPassword(e.target.value)} />
        </form>
      </div>
      <button
        onClick={handleLogoutBtn}
        className="cursor-pointer mt-6 px-6 py-2 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
      >
        Logout
      </button>
    </>
  );
};

export default Profile;
