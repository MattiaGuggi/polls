'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Vote, ArrowRight } from "lucide-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, isAuthenticated } = useUser();
  const router = useRouter();

  const toggleIcon = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!(/\S+@\S+\.\S+/.test(email))) {
      setError("Invalid email format");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        router.push('/');
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-8">
      <div
        ref={containerRef}
        className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-indigo-950/60 overflow-hidden relative"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="p-8 sm:p-10 relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="size-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 mb-4 border border-indigo-400/30">
              <Vote className="size-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Sign in to manage your polls and votes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2.5">
              <AlertCircle className="size-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-400">
                  <Mail className="size-5 text-indigo-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-slate-400">
                  <Lock className="size-5 text-indigo-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={toggleIcon}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? (
                    <Eye className="size-5 text-indigo-400" />
                  ) : (
                    <EyeOff className="size-5 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              className="cursor-pointer mt-2 w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 active:scale-[0.98] text-base flex items-center justify-center gap-2 border border-indigo-400/30"
              type="submit"
            >
              <span>Login</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>

        <div className="px-8 py-4 bg-slate-950/40 border-t border-white/5 flex justify-center text-sm">
          <p className="text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push('/signup')}
              className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline cursor-pointer transition-colors ml-1"
              type="button"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;