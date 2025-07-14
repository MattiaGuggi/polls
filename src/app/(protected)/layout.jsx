'use client';
import Link from "next/link";
import React from "react";
import AnimatedContent from "../components/AnimatedContent";
import { usePathname } from "next/navigation";


const RootLayout = ({ children }) => {
  const pathname = usePathname();
  return (
    <>
      <header className="fixed flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm dark:bg-neutral-800 py-5 top-0 shadow-custom">
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

      <AnimatedContent>
        <main className="w-full flex-1 flex flex-col items-center justify-center">{children}</main>
      </AnimatedContent>
    </>
  );
}

export default RootLayout;