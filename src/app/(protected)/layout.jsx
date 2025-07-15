'use client';
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Loading from "../loading";

const RootLayout = ({ children }) => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const [isReady, setisReady] = useState(false);

  useEffect(() => {
    setisReady(false);
    const timeout = setTimeout(() => setisReady(true), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  useGSAP(() => {
    if (!isReady) return;
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
  }, [pathname, isReady]);

  if (!isReady) {
    return <Loading />
  }

  return (
    <div className="flex w-full min-h-screen h-full opacity-100" ref={containerRef}>
      <header ref={headerRef} className="absolute flex flex-wrap sm:justify-start sm:flex-nowrap w-full h-20 bg-white text-sm dark:bg-neutral-800 py-5 top-0 shadow-custom">
        <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <div
            id="hs-navbar-example"
            className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
            aria-labelledby="hs-navbar-example-collapse"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              <Link
                href="/"
                className={`text-lg font-bold tracking-wide transition-all duration-200
                  ${pathname === "/" ? "text-transparent bg-clip-text bg-gradient-to-l from-indigo-700 to-indigo-900 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-indigo-950" :
                  "text-white hover:bg-gradient-to-l from-indigo-700 to-indigo-900 hover:bg-clip-text hover:text-transparent"}`}
              >
                Home
              </Link>
              <Link
                href="/poll"
                className={`text-lg font-bold tracking-wide transition-all duration-200
                  ${pathname.startsWith("/poll") ? "text-transparent bg-clip-text bg-gradient-to-l from-indigo-700 to-indigo-900 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-indigo-950" :
                  "text-white hover:bg-gradient-to-l from-indigo-700 to-indigo-900 hover:bg-clip-text hover:text-transparent"}`}
              >
                Polls
              </Link>
              <Link
                href="/profile"
                className={`text-lg font-bold tracking-wide transition-all duration-200
                  ${pathname.startsWith("/profile") ? "text-transparent bg-clip-text bg-gradient-to-l from-indigo-700 to-indigo-900 hover:bg-gradient-to-r hover:from-indigo-800 hover:to-indigo-950" :
                  "text-white hover:bg-gradient-to-l from-indigo-700 to-indigo-900 hover:bg-clip-text hover:text-transparent"}`}
              >
                Profile
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main ref={mainRef} className="w-full h-full flex-1 flex flex-col items-center justify-center mt-20">{children}</main>
    </div>
  );
}

export default RootLayout;