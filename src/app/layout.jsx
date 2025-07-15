import { UserProvider } from './context/UserContext';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className='relative w-full h-full text-center flex justify-center items-center flex-col overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-violet-900 min-h-screen overflow-y-auto'
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
