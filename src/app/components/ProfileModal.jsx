import ProfileModalWrapper from './ProfileModalWrapper';

const ProfileModal = ({ message, username, email, password, handleSubmit, setUsername, setEmail, setPassword, setIsOpen }) => {
  return (
    <div className='w-1/4 min-h-full bg-white px-8 py-16 rounded-3xl shadow-lg flex flex-col items-center shadow-custom'>
      <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text'>Your Profile</h1>
      {message && (
        <div className='bg-green-500 px-5 py-2 rounded-md mb-4'>
          <p className='text-green-800'>{message}</p>
        </div>
      )}
      <ProfileModalWrapper
        message={message}
        username={username}
        email={email}
        password={password}
        handleSubmit={handleSubmit}
        setUsername={setUsername}
        setEmail={setEmail}
        setPassword={setPassword}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default ProfileModal;
