'use client';
import axios from 'axios';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Loading from '@/app/loading';
import Toast from '@/app/components/Toast';
import { participantType, pollType } from '@/lib/types';

const PollEdit = () => {
  const params = useParams();
  const id = params?.id as string;
  const [poll, setPoll] = useState<pollType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editParticipants, setEditParticipants] = useState<participantType[]>([]);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const getPoll = async () => {
    try {
      const response = await axios.get(`/api/polls/get`, { params: { id } });
      const data = response.data;
      setPoll(data.poll);
      setEditParticipants(data.poll.participants.map((p: participantType) => ({ ...p })));
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching poll:', err);
      return notFound();
    }
  };

  useEffect(() => {
    if (id) {
      getPoll();
    }
  }, [id]);

  const handleParticipantChange = (idx: number, field: keyof participantType, value: any) => {
    setEditParticipants((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveParticipant = async (idx: number) => {
    if (!poll) return;
    setSavingIdx(idx);
    try {
      const participant = editParticipants[idx];
      const updatedParticipants = poll.participants.map((p, index) => {
        if (index === idx) {
          return {
            ...p,
            name: participant.name,
            image: participant.image,
          };
        }
        return p;
      });

      const sortedScoreboard = [...updatedParticipants].sort(
        (a, b) => ((b as any).rating ?? 0) - ((a as any).rating ?? 0)
      );

      const newPoll = {
        ...poll,
        participants: updatedParticipants,
        scoreboard: sortedScoreboard,
      };

      await axios.post('/api/polls/update', { poll: newPoll });
      await getPoll();
      setToastMessage('Participant saved successfully');
    } catch (err) {
      console.error('Error saving participant', err);
    } finally {
      setSavingIdx(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}
      <Link href="/profile" className="text-white cursor-pointer duration-400 transition-all hover:scale-125">
        <MoveLeft />
      </Link>
      <h1 className="font-bold text-4xl text-white py-5 mt-9">Editing Poll: {id}</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {poll ? (
            <div className="flex flex-col items-center mt-5">
              <input
                className="text-xl text-white my-10 border rounded-2xl px-10 py-5"
                placeholder="Poll Name"
                value={poll.name}
                onChange={(e) =>
                  setPoll((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                }
              />
              <img src={poll.image} alt={poll.name} className="w-64 h-64 rounded-lg shadow-lg object-cover" />
              <p className="text-white font-bold text-2xl mt-28">Participants:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 my-8 w-full px-4">
                {editParticipants.map((participant, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-indigo-900/80 to-indigo-700/80 border border-indigo-800 rounded-2xl shadow-xl flex flex-col items-center p-6 transition-transform duration-200 hover:scale-105 min-h-[370px] relative"
                  >
                    <div className="w-28 h-28 mb-4 flex items-center justify-center">
                      <img
                        src={
                          participant.image ||
                          `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(participant.image || participant.name)}`
                        }
                        alt={participant.name}
                        className="rounded-full shadow-lg w-28 h-28 object-cover border-4 border-indigo-600 bg-white"
                      />
                    </div>
                    <input
                      className="py-2 px-4 text-white mb-3 border border-indigo-600 bg-indigo-800/60 rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-indigo-200"
                      value={participant.name}
                      onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <label className="mb-3 w-full flex justify-center">
                      <span className="py-2 px-4 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg cursor-pointer font-semibold transition duration-200">
                        Scegli immagine
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                handleParticipantChange(idx, 'image', reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      className={`mt-auto py-2 px-6 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg transition duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                        savingIdx === idx ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => handleSaveParticipant(idx)}
                      disabled={savingIdx === idx}
                    >
                      {savingIdx === idx ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-500">Poll not found</p>
          )}
        </>
      )}
    </div>
  );
};

export default PollEdit;