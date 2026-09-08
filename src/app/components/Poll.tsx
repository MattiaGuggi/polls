import { pollType } from '@/lib/types';
import { useRouter } from 'next/navigation';

const Poll = ({ poll, mode = 'play' } : { poll: pollType, mode?: string }) => {
  const router = useRouter();

  const handlePoll = () => {
    switch(mode) {
      case 'play':
        router.push(`/poll/${poll._id}`);
        break;
      case 'edit':
        router.push(`/poll/${poll._id}/edit`);
        break;
    }
  };

  return (
    <div 
      className="h-56 w-56 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105" 
      onClick={handlePoll}
    >
      <img src={poll.image || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(poll.name)}`} alt={poll.name} className="w-5/6 h-5/6 rounded-3xl shadow-custom object-cover" />
      <h3 className="my-4 font-semibold text-base text-white">{poll.name}</h3>
    </div>
  );
};

export default Poll;