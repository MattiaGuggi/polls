'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MoveLeft, Save, Upload, User, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import Toast from '@/app/components/Toast';
import { participantType, pollType } from '@/lib/types';
import { uploadFiles } from '@/lib/uploadthing';

const PollEdit = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [poll, setPoll] = useState<pollType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editParticipants, setEditParticipants] = useState<participantType[]>([]);
  
  // Existing Edit States
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // New Participant States
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newParticipantName, setNewParticipantName] = useState<string>('');
  const [newParticipantImg, setNewParticipantImg] = useState<string>('');
  const [isUploadingNew, setIsUploadingNew] = useState<boolean>(false);
  const [isSavingNew, setIsSavingNew] = useState<boolean>(false);

  const getPoll = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(`/api/polls/get`, { params: { id } });
      const data = response.data;
      if (!data?.poll) {
        router.push('/404');
        return;
      }
      setPoll(data.poll);
      setEditParticipants(data.poll.participants.map((p: participantType) => ({ ...p })));
    } catch (err) {
      console.error('Error fetching poll:', err);
      router.push('/404');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    getPoll();
  }, [getPoll]);

  // Lock scrolling when Add Modal is open
  useEffect(() => {
    if (isAdding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdding]);

  // ----------------------------------------------------
  // Edit Existing Participant
  // ----------------------------------------------------
  const handleParticipantChange = (idx: number, field: keyof participantType, value: any) => {
    setEditParticipants((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  const handleImageUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    try {
      const res = await uploadFiles('imageUploader', { files: [file] });
      if (res && res[0]?.url) {
        handleParticipantChange(idx, 'image', res[0].url);
        setToastMessage('Image uploaded to Uploadthing');
      }
    } catch (err) {
      console.error('Failed to upload image to Uploadthing:', err);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSaveParticipant = async (idx: number) => {
    if (!poll) return;
    setSavingIdx(idx);
    try {
      const updatedParticipants = editParticipants.map((p, index) => {
        const originalRating = poll.participants[index]?.rating ?? 1000;
        return { ...p, rating: originalRating };
      });

      const sortedScoreboard = [...updatedParticipants].sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
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
      console.error('Error saving participant:', err);
    } finally {
      setSavingIdx(null);
    }
  };

  // ----------------------------------------------------
  // Add New Participant
  // ----------------------------------------------------
  const handleNewImageUpload = async (file: File) => {
    setIsUploadingNew(true);
    try {
      const res = await uploadFiles('imageUploader', { files: [file] });
      if (res && res[0]?.url) {
        setNewParticipantImg(res[0].url);
      }
    } catch (err) {
      console.error('Failed to upload new participant image:', err);
    } finally {
      setIsUploadingNew(false);
    }
  };

  const handleSaveNewParticipant = async () => {
    if (!poll || !newParticipantName.trim()) return;
    setIsSavingNew(true);
    try {
      const newParticipant: participantType = {
        name: newParticipantName,
        image: newParticipantImg,
        rating: 1000,
      };

      const updatedParticipants = [...poll.participants, newParticipant];
      const sortedScoreboard = [...(poll.scoreboard || []), newParticipant].sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
      );

      const newPoll = {
        ...poll,
        participants: updatedParticipants,
        scoreboard: sortedScoreboard,
      };

      await axios.post('/api/polls/update', { poll: newPoll });
      await getPoll();
      
      setToastMessage('New participant added successfully');
      setIsAdding(false);
      setNewParticipantName('');
      setNewParticipantImg('');
    } catch (err) {
      console.error('Error adding new participant:', err);
    } finally {
      setIsSavingNew(false);
    }
  };

  // ----------------------------------------------------
  // Delete Actions
  // ----------------------------------------------------
  const handleDeleteParticipant = async (idx: number) => {
    if (!poll) return;
    if (!window.confirm('Are you sure you want to remove this participant?')) return;

    try {
      const participantToRemove = editParticipants[idx];
      
      // 1. Delete image from UploadThing storage if it exists
      if (participantToRemove.image && participantToRemove.image.includes('utfs.io')) {
        // We run this asynchronously and catch errors so it doesn't block UI updates if it fails
        await axios.post('/api/uploadthing/delete', { url: participantToRemove.image }).catch(console.error);
      }

      // 2. Filter out the selected participant
      const updatedParticipants = editParticipants.filter((_, i) => i !== idx);
      
      // 3. Filter scoreboard by name
      const updatedScoreboard = (poll.scoreboard || []).filter(
        (p) => p.name !== participantToRemove.name
      );

      const newPoll = {
        ...poll,
        participants: updatedParticipants,
        scoreboard: updatedScoreboard,
      };

      // 4. Update the database
      await axios.post('/api/polls/update', { poll: newPoll });
      await getPoll();
      setToastMessage('Participant removed successfully');
    } catch (err) {
      console.error('Error removing participant:', err);
      setToastMessage('Error removing participant');
    }
  };

  const handleDeletePoll = async () => {
    if (!window.confirm('Are you sure you want to completely delete this poll? This cannot be undone.')) return;
    
    try {
      await axios.delete('/api/polls/delete', { data: { id } });
      router.push('/profile'); // Redirect back to profile after successful deletion
    } catch (err) {
      console.error('Error deleting poll:', err);
      setToastMessage('Failed to delete poll');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center p-6 sm:p-10 pt-24 md:pt-32 pb-20 relative">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      )}

      {/* Top Header Bar */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all duration-200 shadow-md group"
        >
          <MoveLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Profile</span>
        </Link>
        <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          ID: {id}
        </span>
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-300 via-white to-violet-300 text-transparent bg-clip-text tracking-tight mb-8">
          Edit Poll Settings
        </h1>

        {isLoading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : poll ? (
          <div className="flex flex-col items-center w-full gap-10">
            
            {/* Poll Details Card */}
            <div className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 flex flex-col items-center gap-6">
              {poll.image && (
                <div className="relative group">
                  <img
                    src={poll.image}
                    alt={poll.name}
                    className="w-40 h-40 rounded-2xl shadow-xl object-cover border border-slate-700/60 ring-4 ring-indigo-500/10"
                  />
                </div>
              )}

              <div className="w-full flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-left px-1">
                  Poll Title
                </label>
                <input
                  className="w-full text-lg font-medium text-slate-100 bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 placeholder:text-slate-600"
                  placeholder="Poll Name"
                  value={poll.name}
                  onChange={(e) =>
                    setPoll((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                  }
                />
              </div>
            </div>

            {/* Participants Section */}
            <div className="w-full flex flex-col items-center gap-6">
              <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-slate-100">Participants</h2>
                </div>
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Participant</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {editParticipants.map((participant, idx) => (
                  <div
                    key={idx}
                    className="relative bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col items-center transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-indigo-950/30 group"
                  >
                    {/* Delete Participant Button */}
                    <button
                      onClick={() => handleDeleteParticipant(idx)}
                      className="absolute top-3 right-3 p-2 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer opacity-70 hover:opacity-100"
                      title="Delete Participant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Avatar Preview */}
                    <div className="relative w-24 h-24 mb-5 mt-2">
                      <img
                        src={
                          participant.image ||
                          `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(participant.name)}`
                        }
                        alt={participant.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 bg-slate-950 shadow-inner group-hover:border-indigo-500/50 transition-colors duration-200"
                      />
                    </div>

                    {/* Participant Name Input */}
                    <div className="w-full mb-4">
                      <input
                        className="w-full py-2.5 px-3.5 text-sm font-medium text-slate-100 bg-slate-950/80 border border-slate-800 rounded-xl text-center focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 placeholder:text-slate-600"
                        value={participant.name}
                        onChange={(e) => handleParticipantChange(idx, 'name', e.target.value)}
                        placeholder="Participant Name"
                      />
                    </div>

                    {/* Image Upload Button */}
                    <label className="w-full mb-4">
                      <span className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white rounded-xl cursor-pointer font-medium transition-all duration-200 text-xs flex items-center justify-center gap-2">
                        {uploadingIdx === idx ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            Choose Image
                          </>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingIdx === idx}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(idx, file);
                          }
                        }}
                      />
                    </label>

                    {/* Save Action */}
                    <button
                      className={`w-full mt-auto py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                        savingIdx === idx || uploadingIdx === idx ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => handleSaveParticipant(idx)}
                      disabled={savingIdx === idx || uploadingIdx === idx}
                    >
                      {savingIdx === idx ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DELETE POLL SECTION */}
            <div className="w-full flex justify-end mt-8 pt-6 border-t border-slate-800/80">
              <button
                onClick={handleDeletePoll}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer shadow-lg hover:shadow-rose-600/25 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Delete Entire Poll
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-rose-400 my-12">
            Poll not found or failed to load.
          </div>
        )}
      </div>

      {/* FIXED Add Participant Overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl w-full max-w-xs flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-100 text-center">Add New Participant</h4>

            <input
              type="text"
              placeholder="Participant Name"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              className="w-full text-sm font-medium text-slate-100 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500/80 transition-all placeholder:text-slate-600"
            />

            <label className="relative flex items-center justify-center w-full py-2.5 px-3 bg-slate-950/80 hover:bg-slate-800/50 border border-dashed border-slate-700/80 rounded-xl cursor-pointer transition-all">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-2">
                {isUploadingNew ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    Upload Avatar
                  </>
                )}
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingNew}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleNewImageUpload(file);
                }}
              />
            </label>

            {newParticipantImg && (
              <img
                src={newParticipantImg}
                alt={newParticipantName}
                className="rounded-full w-16 h-16 object-cover border-2 border-indigo-500/30 self-center shadow-md"
              />
            )}

            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewParticipantName('');
                  setNewParticipantImg('');
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewParticipant}
                disabled={isUploadingNew || isSavingNew || !newParticipantName.trim()}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isSavingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollEdit;