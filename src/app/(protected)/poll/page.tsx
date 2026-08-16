'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import Modal from '@/app/components/Modal';
import Poll from '@/app/components/Poll';
import { useUser } from '@/app/context/UserContext';
import Toast from '@/app/components/Toast';
import Loading from '@/app/loading';
import { pollType } from '@/lib/types';

const INITIAL_POLL_STATE: pollType = {
  name: '',
  participants: [],
  image: '',
};

const PollView = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [polls, setPolls] = useState<pollType[]>([]);
  const [pollData, setPollData] = useState<pollType>(INITIAL_POLL_STATE);

  const { user } = useUser();

  const updatePollData = (key: keyof pollType, value: any) => {
    setPollData((prev) => ({
      ...prev,
      [key]: typeof value === 'function' ? value(prev[key]) : value,
    }));
  };

  const getAllPolls = useCallback(async () => {
    try {
      const response = await axios.get(`/api/polls/get-all`);
      setPolls(response.data.polls || []);
    } catch (err) {
      console.error('Error getting all polls:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPoll = async () => {
    try {
      const response = await axios.post(`/api/polls/create`, {
        ...pollData,
        creator: user?._id,
      });
      setMessage(response.data.message);
      setIsOpen(false);
      setPollData(INITIAL_POLL_STATE);
      await getAllPolls();
    } catch (err) {
      console.error('Error creating poll:', err);
    }
  };

  useEffect(() => {
    getAllPolls();
  }, [getAllPolls]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start relative overflow-hidden pt-28 pb-12 px-4">
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ filter: 'blur(120px)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200"
        style={{ filter: 'blur(120px)' }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex flex-row items-center justify-between w-full max-w-5xl mb-10 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
            All Polls
          </h2>
          <button
            className="flex items-center gap-2 py-2 px-5 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 hover:scale-105 text-lg cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Plus />
            <span className="hidden sm:inline">Create Poll</span>
          </button>
        </div>

        {isOpen && (
          <Modal
            createPoll={createPoll}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            setPollData={updatePollData}
            pollData={pollData}
          />
        )}

        {message && (
          <Toast
            message={message}
            type="success"
            onClose={() => setMessage('')}
          />
        )}

        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 md:p-8 justify-items-center">
            {polls.map((poll, idx) => (
              <Poll key={poll._id || idx} poll={poll} mode="play" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollView;