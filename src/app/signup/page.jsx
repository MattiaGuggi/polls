'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { validateEmail } from '../../lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

const signup = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isAuthenticated } = useUser();
  const router = useRouter();
  
  const toggleIcon = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      signup();
    } else {
      setError(data.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden xs:w-11/12"
    >
      <div className="p-8">
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text'>
          Create Account
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={`input relative w-full flex`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none scale-110">
              <User className="size-5 text-indigo-900" />
            </div>
            <input
              type={'text'}
              required
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={`w-full h-full pl-12 pr-12 py-4 bg-opacity-50 rounded-lg border border-gray-700 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700 placeholder-gray-400 transition duration-200 xs:py-3`}
            />
          </div>
          <div className={`input relative w-full flex`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none scale-110">
              <Mail className="size-5 text-indigo-900" />
            </div>
            <input
              type={'email'}
              required
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className={`w-full h-full pl-12 pr-12 py-4 bg-opacity-50 rounded-lg border border-gray-700 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700 placeholder-gray-400 transition duration-200 xs:py-3`}
            />
          </div>
          <div className={`input relative w-full flex`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none scale-110">
              <Lock className="size-5 text-indigo-900" />
            </div>
            <input
              type={'password'}
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className={`w-full h-full pl-12 pr-12 py-4 bg-opacity-50 rounded-lg border border-gray-700 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700 placeholder-gray-400 transition duration-200 xs:py-3`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
              {showPassword ? (
                <Eye className="size-5 text-indigo-900" onClick={toggleIcon} />
              ) : (
                <EyeOff className="size-5 text-indigo-900" onClick={toggleIcon} />
              )}
            </div>
          </div>
          <PasswordStrengthMeter password={password} />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
          Sign Up
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-600 bg-opacity-50 flex justify-center">
        <p className="text-sm text-indigo-950">
          {"Already have an account?"}
          <button onClick={() => router.push('/login')} className="text-bg-indigo-700 hover:underline" type="button">
            Login
          </button>
        </p>
      </div>
    </motion.div>
  )
}

export default signup
