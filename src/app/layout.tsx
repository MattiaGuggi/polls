import { UserProvider } from './context/UserContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans antialiased flex flex-col items-center justify-center overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200"
      >
        {/* Ambient Glows & Tactical Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] animate-pulse delay-500" />
          <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
        </div>

        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}