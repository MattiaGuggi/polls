'use client'
import React from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { MoveLeft } from 'lucide-react';

const pollGame = () => {
    const params = useParams();
    const { id } = params;
    const router = useRouter();
    const [poll, setPoll] = useState(null);
    const [finalWinner, setFinalWinner] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [allParticipants, setAllParticipants] = useState([]);
    const [currentPair, setCurrentPair] = useState([]);
    const [nextRound, setNextRound] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // index in participants array
    const [round, setRound] = useState(1);
    const [totRounds, setTotRounds] = useState(1);

    const checkId = async () => {
        try {
            const response = await axios.get(`/api/polls/get-all`);
            const data = response.data;
            const polls = data.polls || [];
            const foundPoll = polls.find(p => p?._id == id);
            if (!foundPoll) return notFound();
        } catch (err) {
            console.error("Error fetching poll:", err);
            return notFound();
        }
    }

    // Fetch poll and initialize
    const getPoll = async () => {
        try {
            const response = await axios.get(`/api/polls/get`, { params: { id } });
            const data = response.data;
            
            // Ensure every participant has a numeric rating
            const normalized = data.poll.participants.map((p) => ({
                ...p,
                rating: typeof p.rating === 'number' ? p.rating : parseFloat(p.rating) || 1000,
            }));

            const shuffled = shuffleArray(normalized);

            setPoll(data.poll);
            setParticipants(shuffled);
            setAllParticipants(shuffled);
            setCurrentIndex(0);
            setNextRound([]);
            setCurrentPair(shuffled.slice(0, 2));
            setFinalWinner(null);
            setRound(1);
            setTotRounds(Math.ceil(data.poll.participants.length / 2));
        } catch (err) {
            console.error("Error fetching poll:", err);
            return notFound();
        }
    };

    // Shuffle helper
    const shuffleArray = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    // Vote on a player
    const vote = (winner) => {
        // Find the winner and loser in the current pair
        const winnerObj = participants[currentIndex]?.name === winner.name ? participants[currentIndex] : participants[currentIndex + 1];
        const loserObj = participants[currentIndex]?.name === winner.name ? participants[currentIndex + 1] : participants[currentIndex];

        // Update ELO ratings
        updateElo(winnerObj, loserObj);

        // Add winner to next round
        const newNextRound = [...nextRound, winnerObj];

        // Check if this was the last pair in the current round
        if (currentIndex + 2 >= participants.length) {
            // If only one winner remains, game is over
            if (newNextRound.length === 1) {
                setUpWin(newNextRound);
            } else {
                // Start next round with winners
                setParticipants(newNextRound);
                setCurrentIndex(0);
                setNextRound([]);
                setCurrentPair(newNextRound.slice(0, 2));
                setRound(1);
                setTotRounds(Math.ceil(newNextRound.length / 2));
            }
        } else {
            // Continue to next pair in current round
            setNextRound(newNextRound);
            setCurrentIndex(currentIndex + 2);
            setCurrentPair(participants.slice(currentIndex + 2, currentIndex + 4));
            setRound(round + 1);
        }
    };

    const updateElo = (winner, loser) => {
        if (!winner || !loser) return [winner, loser];

        const k = 32;

        const winnerRating = typeof winner.rating === 'number' ? winner.rating : parseFloat(winner.rating) || 1000;
        const loserRating = typeof loser.rating === 'number' ? loser.rating : parseFloat(loser.rating) || 1000;

        const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
        const expectedLoser = 1 - expectedWinner;

        const updatedWinner = {
            ...winner,
            rating: Number((winnerRating + k * (1 - expectedWinner)).toFixed(2))
        };

        const updatedLoser = {
            ...loser,
            rating: Number((loserRating + k * (0 - expectedLoser)).toFixed(2))
        };

        setAllParticipants((prev) =>
            prev.map((p) => {
                if (p.name === updatedWinner.name) return updatedWinner;
                if (p.name === updatedLoser.name) return updatedLoser;
                return p;
            })
        );
    };

    const setUpWin = async (updatedNextRound) => {
        const sortedParticipants = [...allParticipants].sort((a, b) => b.rating - a.rating);
        setFinalWinner(updatedNextRound[0]);
        setAllParticipants(sortedParticipants);

        try {
            // Create updated poll object directly
            const updatedPoll = {
                ...poll,
                participants: allParticipants.map(p => ({
                    name: p.name,
                    image: p.image,
                    rating: typeof p.rating === 'number' ? p.rating : parseFloat(p.rating) || 1000
                })),
                scoreboard: sortedParticipants.map(p => ({
                    name: p.name,
                    image: p.image,
                    rating: typeof p.rating === 'number' ? p.rating : parseFloat(p.rating) || 1000,
                })),
            };

            await axios.post(`/api/polls/update`, { poll: updatedPoll });
        } catch(err) {
            console.error('Error updating poll', err);
        }
    };

    const goBack = () => {
        router.push(`/poll/${id}`);
    };

    const initializeGame = async () => {
        await checkId();
        await getPoll();
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden py-10">
            {/* Decorative blurred background shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" style={{ filter: 'blur(120px)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse delay-200" style={{ filter: 'blur(120px)' }} />
            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto p-8">
                <button onClick={goBack} className="cursor-pointer self-start mb-4 text-white rounded-full p-2 hover:scale-110 transition duration-200"><MoveLeft /></button>
                <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">🎮 Playing Poll: <span className="text-indigo-300">{id}</span></h2>
                {finalWinner ? (
                    <div className="text-center mt-10">
                        <h2 className="text-3xl font-bold text-green-400 mb-5 drop-shadow-lg">🏆 Winner: {finalWinner.name}</h2>
                        <img
                            src={finalWinner.image == '' ? `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(finalWinner.username)}` : finalWinner.image}
                            alt={finalWinner.name}
                            className="rounded-xl object-cover shadow-lg mx-auto w-64 h-64 mb-6 bg-white"
                        />
                        <div className='flex flex-col items-center justify-center rounded-xl bg-indigo-800/80 mt-6 py-4 px-6 shadow-inner'>
                            <h3 className="text-lg font-bold text-indigo-200 mb-2">Final Standings</h3>
                            {allParticipants.map((person, idx) => (
                                <h3 key={idx} className="text-base font-semibold my-2 text-white">
                                    {person.name} <span className="text-indigo-300">({Math.round(person.rating)})</span>
                                </h3>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-4 text-indigo-200">Round {round} of {totRounds}</h3>
                        <div
                            key={currentPair.map((p) => p).join('-')}
                            className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 justify-items-center w-full"
                        >
                            {currentPair.map((person, idx) => (
                                <div key={idx} className='flex flex-col w-full h-full transition-all duration-400 hover:scale-105 items-center'>
                                    <h3 className="text-lg font-bold mb-2 text-white">{person.name}</h3>
                                    <img
                                        src={person.image == '' ? `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(person.username)}` : person.image}
                                        alt={person.name}
                                        className="rounded-xl object-cover shadow-lg w-56 h-56 bg-white border-indigo-700 cursor-pointer"
                                        onClick={() => vote(person)}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default pollGame;
