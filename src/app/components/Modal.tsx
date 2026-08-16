'use client';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { pollType, participantType } from '@/lib/types';

interface ModalProps {
  createPoll: () => void;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  setPollData: (key: keyof pollType, value: any) => void;
  pollData: pollType;
}

const Modal = ({ createPoll, setIsOpen, isOpen, setPollData, pollData }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentParticipantName, setCurrentParticipantName] = useState('');
  const [currentParticipantImg, setCurrentParticipantImg] = useState('');

  const handleAddParticipant = () => {
    setPollData('participants', (prev: participantType[]) => [
      ...(prev || []),
      { name: currentParticipantName, image: currentParticipantImg },
    ]);
    setCurrentParticipantName('');
    setCurrentParticipantImg('');
    setIsAdding(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useGSAP(() => {
    if (containerRef.current && isOpen) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all', // Removes residual GPU transform/opacity layers
        }
      );
    }
  }, { dependencies: [isOpen], scope: containerRef });

  if (typeof window === 'undefined' || !isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 h-screen w-screen bg-black/70 flex items-center justify-center z-[9999]">
      <div
        ref={containerRef}
        className="bg-white py-10 px-5 rounded-xl shadow-xl w-1/3 max-w-lg mx-4"
      >
        <div className="w-full">
          <h2 className="my-3 font-semibold text-xl">Create a poll</h2>
        </div>

        <div className="content flex flex-col my-4 p-2 items-center">
          <input
            type="text"
            value={pollData.name}
            onChange={(e) => setPollData('name', e.target.value)}
            placeholder="Poll name"
            className="w-full border rounded-lg px-5 py-3 my-5 cursor-pointer"
          />
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded-lg px-5 py-3 my-5 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (typeof reader.result === 'string') {
                    setPollData('image', reader.result);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {pollData.image && (
            <img src={pollData.image} alt={pollData.name} className="rounded-2xl w-28 h-28 mb-5" />
          )}
          <div className="flex items-center justify-center">
            <button
              className="border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl flex items-center justify-center text-lg font-medium w-11 h-11 shadow-custom transition-transform duration-200 hover:scale-110"
              onClick={() => setIsAdding(true)}
            >
              <Plus />
            </button>
          </div>
          {pollData.participants && pollData.participants.length > 0 && (
            <>
              <h3 className="text-base font-medium mt-4">Participants:</h3>
              <div className="grid grid-cols-3 gap-4 px-3 py-5">
                {pollData.participants.map((participant, idx) => (
                  <div key={idx} className="flex gap-4 px-3 py-5 items-center">
                    <p className="text-sm font-medium">{participant.name}</p>
                    <img src={participant.image} alt={participant.name} className="w-16 h-16 rounded-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
          {isAdding && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="flex flex-col gap-4 px-6 py-5 bg-white shadow-custom rounded-xl items-center w-80">
                <input
                  type="text"
                  placeholder="Participant name"
                  value={currentParticipantName}
                  onChange={(e) => setCurrentParticipantName(e.target.value)}
                  className="w-full border rounded-lg px-5 py-3 mt-5 cursor-pointer"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg px-5 py-3 mb-5 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setCurrentParticipantImg(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {currentParticipantImg && (
                  <img src={currentParticipantImg} alt={currentParticipantName} className="rounded-2xl w-28 h-28 mb-5 object-cover" />
                )}
                <div className="flex items-center justify-center gap-10">
                  <button
                    className="border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl text-lg font-medium w-24 h-11 shadow-custom hover:scale-110 transition-transform duration-200"
                    onClick={handleAddParticipant}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="cursor-pointer w-24 h-11 bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition-transform duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center w-full gap-10 mt-6">
          <button
            onClick={createPoll}
            className="border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl text-lg font-medium w-24 h-11 shadow-custom transition-transform duration-200 hover:scale-110"
          >
            Create
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer w-24 h-11 bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition-transform duration-200"
          >
            x
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;