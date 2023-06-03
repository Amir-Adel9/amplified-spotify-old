'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();

  function createSession() {
    const sessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
    router.push(
      `https://accounts.spotify.com/authorize?client_id=680c63260c134834b22df08c1823e7ec&response_type=code&redirect_uri=${
        process.env.ENVIRONMENT === 'PRODUCTION'
          ? 'https://spotifycards.vercel.app/'
          : 'http://localhost:3001/'
      }&scope=user-read-private%20user-read-email%20user-top-read&state=34fFs29kd09`
    );
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = localStorage.getItem('sessionId');

    if (accessToken && sessionId) {
      router.push(
        `https://accounts.spotify.com/authorize?client_id=680c63260c134834b22df08c1823e7ec&response_type=code&redirect_uri=${
          process.env.ENVIRONMENT === 'PRODUCTION'
            ? 'https://spotifycards.vercel.app/'
            : 'http://localhost:3001/'
        }&scope=user-read-private%20user-read-email%20user-top-read&state=34fFs29kd09`
      );
    }
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex flex-col gap-10 items-center'>
        <h1 className='text-6xl font-bold text-center text '>
          Welcome to Spotify Cards!
        </h1>

        <button
          className='w-1/3 bg-black text-white rounded p-2'
          onClick={createSession}
        >
          <h2>Log in now</h2>
        </button>
      </div>
    </main>
  );
};

export default Home;
