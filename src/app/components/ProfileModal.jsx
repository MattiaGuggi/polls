import ProfileModalWrapper from './ProfileModalWrapper';
import Toast from './Toast';

const ProfileModal = ({ message, setMessage, username, email, password, handleSubmit, setUsername, setEmail, setPassword, setIsOpen }) => {
  return (
    <div className='w-1/4 min-h-full bg-white px-8 py-16 rounded-3xl shadow-lg flex flex-col items-center shadow-custom'>
      <h1 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text'>Your Profile</h1>
      {message && (
        <Toast
          message={message}
          type={'success'}
          onClose={() => setMessage('')}
        />
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
