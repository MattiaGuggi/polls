'use client';
import { Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { useEffect, useState } from 'react';
import Poll from '../../components/Poll';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import Toast from '../../components/Toast';
import Loading from '../../loading';

const pollView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [polls, setPolls] = useState([]);
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [img, setImg] = useState('');
  const { user } = useUser();

  const createPoll = async () => {
    console.log('Creating poll with:', { name, participants, img, creator: user?._id });
    try {
      const response = await axios.post(`/api/polls/create`, { name, participants, img, creator: user._id });
      const data = response.data;
      setMessage(data.message);
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating poll: ', err);
    }
  };

  const getAllPolls = async () => {
    try {
      const response = await axios.get(`/api/polls/get-all`);
      const data = response.data;
      setPolls(data.polls);
      setIsLoading(false);
    } catch (err) {
      console.error('Error getting all polls', err);
    }
  };

  useEffect(() => {
    setPolls([]);
    getAllPolls();
  }, []);

  return (
    <>
      <div className='w-full h-full'>
        <div className='flex flex-col items-center justify-center mt-20'>
          <Plus className='cursor-pointer' onClick={() => setIsOpen(true)} />
          {isOpen && <Modal createPoll={createPoll} setIsOpen={setIsOpen} isOpen={isOpen}
            setImg={setImg} setName={setName} setParticipants={setParticipants} img={img} name={name} participants={participants} />}
          {message && (
            <Toast
              message={message}
              type={'success'}
              onClose={() => setMessage('')}
            />
          )}
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='w-full grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-6 p-10 justify-items-center'>
            {polls.map((poll, idx) => (
              <Poll key={idx} poll={poll} moode='play' />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default pollView;
