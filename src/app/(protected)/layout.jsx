'use client';
import Link from "next/link";
import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const RootLayout = ({ children }) => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  useGSAP(() => {
    gsap.from([headerRef.current, mainRef.current], {
      opacity: 0,
      y: (i, target) => target === headerRef.current ? 0 : 60,
      scale: (i, target) => target === mainRef.current ? 0.98 : 1,
      filter: 'blur(12px)',
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0,
    });
    gsap.to([headerRef.current, mainRef.current], {
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.4,
      ease: 'expo.out',
      stagger: 0,
    }, '-=0.3');
  }, [pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" ref={containerRef}>
      {/* Decorative blurred background shapes for consistency with home page */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" style={{ filter: 'blur(120px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200" style={{ filter: 'blur(120px)' }} />
      <div className="relative z-10 flex w-full min-h-screen h-full opacity-100">
        <header
          ref={headerRef}
          className="absolute flex flex-wrap sm:justify-start sm:flex-nowrap w-full h-20 top-0 z-20 bg-white/10 dark:bg-neutral-900/30 backdrop-blur-xl border-b border-indigo-800/40 shadow-xl"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
        >
          <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between h-full">
            <div
              id="hs-navbar-example"
              className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
              aria-labelledby="hs-navbar-example-collapse"
            >
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                <Link
                  href="/"
                  className={`text-lg font-extrabold tracking-wide transition-all duration-200 px-4 py-2 rounded-xl
                    ${pathname === "/" ? "bg-gradient-to-r from-indigo-500 to-indigo-900 text-white shadow-lg scale-105" :
                    "text-indigo-100 hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-900 hover:text-white"}`}
                >
                  Home
                </Link>
                <Link
                  href="/poll"
                  className={`text-lg font-extrabold tracking-wide transition-all duration-200 px-4 py-2 rounded-xl
                    ${pathname.startsWith("/poll") ? "bg-gradient-to-r from-indigo-500 to-indigo-900 text-white shadow-lg scale-105" :
                    "text-indigo-100 hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-900 hover:text-white"}`}
                >
                  Polls
                </Link>
                <Link
                  href="/profile"
                  className={`text-lg font-extrabold tracking-wide transition-all duration-200 px-4 py-2 rounded-xl
                    ${pathname.startsWith("/profile") ? "bg-gradient-to-r from-indigo-500 to-indigo-900 text-white shadow-lg scale-105" :
                    "text-indigo-100 hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-900 hover:text-white"}`}
                >
                  Profile
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main ref={mainRef} className="w-full h-full flex-1 flex flex-col items-center justify-center mt-20">{children}</main>
      </div>
    </div>
  );
}

export default RootLayout;