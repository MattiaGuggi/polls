import { useGSAP } from '@gsap/react';
import ProfileModalWrapper from './ProfileModalWrapper';
import Toast from './Toast';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const ProfileModal = ({ message, setMessage, currentUser, handleSubmit, setCurrentUser, setIsOpen }) => {
  const containerRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Opening animation
  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }
    );
  }, []);

  // Run closing animation when isClosing is true
  useEffect(() => {
    if (isClosing) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -500,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => setIsOpen(false),
      });
    }
  }, [isClosing, setIsOpen]);

  const handleClose = () => {
    setIsClosing(true);
  };

  return (
    <div ref={containerRef} className='w-sm bg-white px-16 py-16 rounded-3xl shadow-lg flex flex-col items-center shadow-custom'>
      <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text'>Your Profile</h1>
      {message && (
        <Toast
          message={message}
          type={'success'}
          onClose={() => setMessage('')}
        />
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
