import React from 'react';

const Loading = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen text-gray-800">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-700 border-opacity-50 mb-6"></div>
      <p className="text-lg font-medium">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
