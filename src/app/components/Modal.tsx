'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import gsap from 'gsap';
import { Plus, Loader2, X, Upload, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { pollType, participantType } from '@/lib/types';
import { uploadFiles } from '@/lib/uploadthing';

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

  // Upload loading states
  const [isUploadingPollImg, setIsUploadingPollImg] = useState(false);
  const [isUploadingParticipantImg, setIsUploadingParticipantImg] = useState(false);

  // Upload main poll image directly to Uploadthing
  const handlePollImageUpload = async (file: File) => {
    setIsUploadingPollImg(true);
    try {
      const res = await uploadFiles('imageUploader', { files: [file] });
      if (res && res[0]?.url) {
        setPollData('image', res[0].url);
      }
    } catch (err) {
      console.error('Failed to upload poll image:', err);
    } finally {
      setIsUploadingPollImg(false);
    }
  };

  // Upload participant image directly to Uploadthing
  const handleParticipantImageUpload = async (file: File) => {
    setIsUploadingParticipantImg(true);
    try {
      const res = await uploadFiles('imageUploader', { files: [file] });
      if (res && res[0]?.url) {
        setCurrentParticipantImg(res[0].url);
      }
    } catch (err) {
      console.error('Failed to upload participant image:', err);
    } finally {
      setIsUploadingParticipantImg(false);
    }
  };

  const handleAddParticipant = () => {
    if (!currentParticipantName.trim()) return;

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

  useGSAP(
    () => {
      if (containerRef.current && isOpen) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            clearProps: 'all',
          }
        );
      }
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  if (typeof window === 'undefined' || !isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 h-screen w-screen bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className="relative bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-2xl shadow-indigo-950/50 w-full max-w-lg overflow-hidden text-slate-100 backdrop-blur-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-200 via-white to-violet-200 text-transparent bg-clip-text">
              Create New Poll
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Poll Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Poll Title
            </label>
            <input
              type="text"
              value={pollData.name}
              onChange={(e) => setPollData('name', e.target.value)}
              placeholder="e.g. Best Movie of the Year"
              className="w-full text-base font-medium text-slate-100 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Poll Cover Image Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Cover Image
            </label>
            <label className="relative flex items-center justify-center w-full py-3 px-4 bg-slate-950/80 hover:bg-slate-800/50 border border-dashed border-slate-700/80 rounded-xl cursor-pointer transition-all group">
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 flex items-center gap-2">
                {isUploadingPollImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    Uploading image...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Choose Cover Image
                  </>
                )}
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingPollImg}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePollImageUpload(file);
                }}
              />
            </label>

            {pollData.image && (
              <div className="relative mt-2 self-center group">
                <img
                  src={pollData.image}
                  alt={pollData.name}
                  className="rounded-2xl w-28 h-28 object-cover border-2 border-indigo-500/30 shadow-lg ring-4 ring-indigo-500/10"
                />
              </div>
            )}
          </div>

          {/* Participants Section */}
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200">
                  Participants ({pollData.participants?.length || 0})
                </h3>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Participant
              </button>
            </div>

            {/* Participants Grid Preview */}
            {pollData.participants && pollData.participants.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                {pollData.participants.map((participant, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-inner"
                  >
                    <img
                      src={
                        participant.image ||
                        `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(participant.name)}`
                      }
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-900"
                    />
                    <p className="text-xs font-semibold text-slate-200 truncate">{participant.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={createPoll}
            disabled={isUploadingPollImg || isUploadingParticipantImg}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            Create Poll
          </button>
        </div>

        {/* Add Participant Sub-Modal Overlay */}
        {isAdding && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl w-full max-w-xs flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-100 text-center">Add Participant</h4>

              <input
                type="text"
                placeholder="Participant Name"
                value={currentParticipantName}
                onChange={(e) => setCurrentParticipantName(e.target.value)}
                className="w-full text-sm font-medium text-slate-100 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500/80 transition-all placeholder:text-slate-600"
              />

              <label className="relative flex items-center justify-center w-full py-2.5 px-3 bg-slate-950/80 hover:bg-slate-800/50 border border-dashed border-slate-700/80 rounded-xl cursor-pointer transition-all">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-2">
                  {isUploadingParticipantImg ? (
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
                  disabled={isUploadingParticipantImg}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleParticipantImageUpload(file);
                  }}
                />
              </label>

              {currentParticipantImg && (
                <img
                  src={currentParticipantImg}
                  alt={currentParticipantName}
                  className="rounded-full w-16 h-16 object-cover border-2 border-indigo-500/30 self-center shadow-md"
                />
              )}

              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setCurrentParticipantName('');
                    setCurrentParticipantImg('');
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddParticipant}
                  disabled={isUploadingParticipantImg || !currentParticipantName.trim()}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;