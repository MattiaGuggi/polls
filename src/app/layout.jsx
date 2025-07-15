import { UserProvider } from './context/UserContext';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className='relative w-full h-full text-center flex justify-center items-center flex-col overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 min-h-screen overflow-y-auto'
      >
        {/* Decorative blurred background shapes for consistency */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" style={{ filter: 'blur(120px)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200" style={{ filter: 'blur(120px)' }} />
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
