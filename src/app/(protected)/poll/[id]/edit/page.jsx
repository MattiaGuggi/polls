'use client'
import axios from 'axios';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import Loading from '../../../../loading';

const pollEdit = () => {
    const params = useParams();
    const { id } = params;
    const [poll, setPoll] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    const getPoll = async () => {
        try {
            const response = await axios.get(`/api/polls/get`, { params: { id } });
            const data = response.data;
            setPoll(data.poll);
            setisLoading(false);
        } catch (err) {
            console.error("Error fetching poll:", err);
            return notFound();
        }
    };

    useEffect(() => {
        getPoll();
    }, [id]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center text-center'>
            <Link href='/profile' className='text-white cursor-pointer duration-400 transition-all hover:scale-125'><MoveLeft /></Link>
            <h1 className='font-bold text-4xl text-white py-5 mt-9'>Editing Poll: {id}</h1>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {poll ? (
                        <div className='flex flex-col items-center mt-5'>
                            <h2 className='text-2xl font-bold text-white my-10'>Poll Name: {poll.name}</h2>
                            <img src={poll.image} alt={poll.name} className='w-64 h-64 rounded-lg shadow-lg' />
                            <p className='text-white font-bold text-2xl mt-28'>Participants:</p>
                            <div className='grid grid-cols-4 gap-5 my-5'>
                                {poll.participants.map((participant, idx) => (
                                    <div key={idx} className='text-white my-5 mx-10 gap-5'>
                                        <h2 className='py-2 px-5'>{participant.name}</h2>
                                        <img src={participant.image || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(participant.image)}`}
                                        alt={participant.name} className='rounded-3xl shadow-custom' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className='text-red-500'>Poll not found</p>
                    )}
                </>
            )}
        </div>
    )
}

export default pollEdit
