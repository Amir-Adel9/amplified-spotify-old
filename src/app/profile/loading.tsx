import React from 'react';

const ProfileLoading = () => {
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <div>
        <div className='animate-pulse'>
          <h1>Loading Your Songs...</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoading;
