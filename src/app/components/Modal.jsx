import { motion } from 'framer-motion';

const Modal = ({ createPoll, open }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50'>
      <motion.div
        className="absolute z-50 bg-white py-10 px-5 rounded-xl shadow-xl w-2/5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className='w-full'>
          <h2 className='my-3 font-semibold text-xl'>Create a poll</h2>
        </div>
        <div className='content grid grid-cols-3 my-4 p-2'>
          <h3 className='text-base font-medium'></h3>
          <img src={''} alt={''} />
        </div>
        <div className='flex justify-center items-center w-full gap-10'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={createPoll}
            className='border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl text-lg font-medium w-24 h-11 shadow-custom transition-all duration-200 xs:scale-90'
          >
            Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={open}
            className='border cursor-pointer bg-gradient-to-r from-indigo-700 to-indigo-900 text-white rounded-xl text-lg font-medium w-24 h-11 shadow-custom transition-all duration-200 xs:scale-90'
          >
            x
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
