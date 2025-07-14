'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import ProfileModal from '../../components/ProfileModal';
import Loading from '../../../app/loading';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false); // <-- Client-side guard
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('User id: ', user._id);
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

  if (!isMounted || !isAuthenticated) {
    return (
      <Loading />
    );
  }

  return (
    <>
      {isOpen ? (
        <ProfileModal message={message} username={username} email={email} password={password} handleSubmit={handleSubmit}
          setUsername={setUsername} setEmail={setEmail} setPassword={setPassword} setIsOpen={setIsOpen}
        />
      ) : (
        <>
          <div className='flex flex-col py-4 px-9'>
            <h1 className='text-2xl font-bold text-white'>{username}</h1>
            <button
              className='cursor-pointer mt-5 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
              hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition duration-200'
              onClick={() => setIsOpen(prev => !prev)}
            >
              Modify
            </button>
          </div>
          <button
              onClick={handleLogoutBtn}
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
