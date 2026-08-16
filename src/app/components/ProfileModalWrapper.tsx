'use client';

const ProfileModalWrapper = ({ handleSubmit, currentUser, setCurrentUser, setIsOpen }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Username</label>
        <input 
          type="text" 
          value={currentUser.username} 
          onChange={(e) => setCurrentUser(prev => ({ ...prev, username: e.target.value }))} 
          className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm" 
          placeholder="Enter username" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Email</label>
        <input 
          type="email" 
          value={currentUser.email} 
          onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))} 
          className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm" 
          placeholder="Enter email" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Password</label>
        <input 
          type="password" 
          value={currentUser.password} 
          onChange={(e) => setCurrentUser(prev => ({ ...prev, password: e.target.value }))} 
          className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-sm" 
          placeholder="Enter new password" 
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Save
        </button>
        <button
          type="button"
          onClick={setIsOpen}
          className="flex-1 py-3 px-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileModalWrapper;