import Link from "next/link";
import React from "react";

const RootLayout = ({ children }) => {
  return (
    <>
        <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
          <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
            <div
              id="hs-navbar-example"
              className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
              aria-labelledby="hs-navbar-example-collapse"
            >
              <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                <Link href='/' className="text-white text-lg font-bold tracking-wide hover:text-green-400 transition-all duration-200">Home</Link>
                <Link href='/poll' className="text-white text-lg font-bold tracking-wide hover:text-green-400 transition-all duration-200">Polls</Link>
                <Link href='/profile' className="text-white text-lg font-bold tracking-wide hover:text-green-400 transition-all duration-200">Profile</Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">{children}</main>
    </>
  );
}

export default RootLayout;