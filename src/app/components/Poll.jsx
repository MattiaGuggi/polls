import { useRouter } from 'next/navigation';

const Poll = ({ poll, mode = 'play' }) => {
  const router = useRouter();

  const handlePoll = async () => {
    switch(mode) {
      case 'play':
        router.push(`/poll/${poll._id}`);
        break;
      case 'edit':
        router.push(`/poll/${poll._id}/edit`);
    }
  };

  return (
    <div className='h-56 w-56 flex flex-col items-center justify-center cursor-pointer duration-400 transition-all hover:scale-110' onClick={handlePoll}>
      <img src={poll.image} alt={poll.name} className='w-5/6 h-5/6 rounded-3xl shadow-custom' />
      <h3 className='my-4 font-semibold text-base text-white'>{poll.name}</h3>
    </div>
  );
};

export default Poll;
