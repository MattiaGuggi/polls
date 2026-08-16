import { useGSAP } from '@gsap/react';
import ProfileModalWrapper from './ProfileModalWrapper';
import Toast from './Toast';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const ProfileModal = ({ message, setMessage, currentUser, handleSubmit, setCurrentUser, setIsOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  // Opening animation
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 80, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'all',
      }
    );
  }, { scope: containerRef });

  // Closing animation
  useEffect(() => {
    if (isClosing && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -40,
        scale: 0.95,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => setIsOpen(false),
      });
    }
  }, [isClosing, setIsOpen]);

  const handleClose = () => {
    setIsClosing(true);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 px-8 py-10 rounded-3xl shadow-2xl shadow-indigo-950/60 flex flex-col items-center text-slate-100"
    >
      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-300 via-white to-violet-300 text-transparent bg-clip-text tracking-tight">
        Your Profile
      </h1>

      {message && (
        <div className="w-full mb-4">
          <Toast
            message={message}
            type={'success'}
            onClose={() => setMessage('')}
          />
        </div>
      )}

      <ProfileModalWrapper
        currentUser={currentUser}
        handleSubmit={handleSubmit}
        setCurrentUser={setCurrentUser}
        setIsOpen={handleClose}
      />
    </div>
  );
};

export default ProfileModal;