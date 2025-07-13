'use client';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { useEffect, useState } from 'react';
import Poll from '../../components/Poll';
import axios from 'axios';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [polls, setPolls] = useState([]);
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [img, setImg] = useState('');
  const API_URL = 'http://localhost:8080';

  const createPoll = async () => {
    try {
      const response = await axios.post(`/api/polls/create`, { name, participants, img });
      const data = response.data;
      setMessage(data.message);
    } catch (err) {
      console.error('Error creating poll: ', err);
    }
  };

  const getAllPolls = async () => {
    try {
      const response = await axios.get(`/api/polls/get-all`);
      const data = response.data;
      setPolls(data.polls);
    } catch (err) {
      console.error('Error getting all polls', err);
    }
  };

  useEffect(() => {
    setPolls([]);
    getAllPolls();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      <div className='w-full h-full'>
        <div className='flex flex-col items-center justify-center mt-20'>
          <Plus className='cursor-pointer' onClick={() => setIsOpen(true)} />
          {isOpen && <Modal createPoll={createPoll} open={() => setIsOpen(false)} />}
          {message && (
            <div className='bg-green-500 px-5 py-2 rounded-xl m-5'>
              <p className='text-green-800'>{message}</p>
            </div>
          )}
        </div>
        <div className='w-full grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10 justify-items-center'>
          {polls.map((poll, idx) => (
            <Poll key={idx} poll={poll} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
