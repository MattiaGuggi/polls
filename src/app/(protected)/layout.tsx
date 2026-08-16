'use client';

import Link from "next/link";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Vote, Home as HomeIcon, BarChart3, User } from "lucide-react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from([headerRef.current, mainRef.current], {
      opacity: 0,
      y: (i, target) => (target === headerRef.current ? 0 : 60),
      scale: (i, target) => (target === mainRef.current ? 0.98 : 1),
      filter: 'blur(12px)',
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0,
    });

    tl.to([headerRef.current, mainRef.current], {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.4,
      ease: 'expo.out',
      stagger: 0,
      clearProps: 'all', // Clears inline filter & transform styles on completion
    }, '-=0.3');
  }, { dependencies: [pathname], scope: containerRef });

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon, active: pathname === "/" },
    { name: "Polls", href: "/poll", icon: BarChart3, active: pathname.startsWith("/poll") },
    { name: "Profile", href: "/profile", icon: User, active: pathname.startsWith("/profile") },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-transparent" ref={containerRef}>
      {/* Background radial spotlights */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[20rem] bg-indigo-600/15 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[35rem] h-[20rem] bg-violet-600/15 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col w-full min-h-screen">
        {/* Floating Glass Bar */}
        <header
          ref={headerRef}
          className="fixed top-4 inset-x-0 mx-auto z-50 max-w-5xl px-4 sm:px-6 w-full"
        >
          <div className="w-full h-16 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-950/40 flex items-center justify-between px-6 transition-all duration-300">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Vote className="size-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Polls<span className="text-indigo-400">App</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1.5 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 px-3.5 py-2 rounded-xl
                      ${
                        item.active
                          ? "bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 scale-100"
                          : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                  >
                    <Icon className={`size-4 ${item.active ? "text-white" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Content Container */}
        <main ref={mainRef} className="w-full flex-1 flex flex-col items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;