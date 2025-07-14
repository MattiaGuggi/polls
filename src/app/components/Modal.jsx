'use client';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const Modal = ({ createPoll, setIsOpen, isOpen, setName, setImg, setParticipants, name, img, participants }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentParticipantName, setCurrentParticipantName] = useState('');
  const [currentParticipantImg, setCurrentParticipantImg] = useState('');

  const handleAddParticipant = () => {
    setParticipants(prev => [...prev, { name: currentParticipantName, img: currentParticipantImg }]);
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

  if (typeof window === 'undefined' || !isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 h-screen w-screen bg-black/70 flex items-center justify-center z-[9999]">
      <motion.div
        className="bg-white py-10 px-5 rounded-xl shadow-xl w-full max-w-lg mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full">
          <h2 className="my-3 font-semibold text-xl">Create a poll</h2>
        </div>

        <div className="content flex flex-col my-4 p-2">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Poll name' className='border rounded-lg px-5 py-3 my-5 cursor-pointer' />
          <input type="file" value={img} onChange={(e) => setImg(e.target.value)} className='border rounded-lg px-5 py-3 my-5 cursor-pointer' />
          <div className='flex items-center justify-center'>
            <button
              className='border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl flex items-center justify-center
              text-lg font-medium w-11 h-11 shadow-custom transition-all duration-200 hover:scale-110'
              onClick={() => setIsAdding(true)}>
                <Plus />
            </button>
          </div>
          {participants.length > 0 && (
            <>
              <h3 className="text-base font-medium">Participants:</h3>
              <div className='grid grid-cols-3 gap-4 px-3 py-5'>
                {participants.map((participant, idx) => (
                  <div key={idx} className='flex gap-4 px-3 py-5'>
                    <p className='text-sm font-medium'>{participant.name}</p>
                    <img src={participant.img} alt={participant.name} className='w-16 h-16 rounded-full' />
                  </div>
                ))}
              </div>
            </>
          )}
          {isAdding && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
              <div className='absolute flex flex-col gap-4 px-3 py-5 bg-white shadow-custom rounded-xl'>
                <input type="text" placeholder='Participant name' value={currentParticipantName} onChange={(e) => setCurrentParticipantName(e.target.value)} className='border rounded-lg px-5 py-3 my-5 cursor-pointer' />
                <input type="file" placeholder='Participant image' value={currentParticipantImg} onChange={(e) => setCurrentParticipantImg(e.target.value)} className='border rounded-lg px-5 py-3 my-5 cursor-pointer' />
                <div className='flex items-center justify-center gap-10'>
                  <button className='border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl text-lg font-medium w-24 h-11 shadow-custom
                    hover:scale-110 transition-all duration-200' onClick={handleAddParticipant}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="cursor-pointer w-24 h-11 bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text font-bold rounded-lg shadow-lg
                    hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition duration-200"
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
            className="border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl text-lg font-medium w-24 h-11 shadow-custom
            transition-all duration-200 hover:scale-110"
          >
            Create
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer w-24 h-11 bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text font-bold rounded-lg shadow-lg
            hover:from-indigo-800 hover:to-indigo-950 hover:scale-110 transition duration-200"
          >
            x
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default Modal;
