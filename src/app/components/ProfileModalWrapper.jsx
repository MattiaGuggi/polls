'use client';
import gsap from 'gsap';

const ProfileModalWrapper = ({ handleSubmit, message, username, email, password, setUsername, setEmail, setPassword, setIsOpen }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='px-7 py-3 my-2 border rounded-lg' placeholder='Username' />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='px-7 py-3 my-2 border rounded-lg' placeholder='Email' />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='px-7 py-3 my-2 border rounded-lg' placeholder='Password' />
      <div className='flex gap-6'>
        <button
          className="cursor-pointer mt-5 w-2/3 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg
          hover:from-indigo-800 hover:to-indigo-950 transition duration-200 hover:scale-110"
          type="submit"
        >
          Save
        </button>
        <button
          type="button"
          className="cursor-pointer mt-5 w-2/3 py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text font-bold rounded-lg
          shadow-lg hover:from-indigo-800 hover:to-indigo-950 transition duration-200 hover:scale-110"
          onClick={setIsOpen}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileModalWrapper;
