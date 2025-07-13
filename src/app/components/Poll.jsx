import { useRouter } from 'next/navigation';

const Poll = ({ poll }) => {
  const router = useRouter();

  const playPoll = async () => {
    router.push(`/poll/${poll._id}`);
  };

  return (
    <div className='h-56 w-56 cursor-pointer duration-400 transition-all hover:scale-110' onClick={playPoll}>
      <img src={poll.image} alt={poll.name} className='w-5/6 h-5/6 rounded-3xl shadow-custom' />
      <h3 className='my-2 font-semibold text-base'>{poll.name}</h3>
    </div>
  );
};

export default Poll;
