'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

const Home = () => {
  const router = useRouter();

  function createSession() {
    const sessionId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
    router.push(
      `https://accounts.spotify.com/authorize?client_id=680c63260c134834b22df08c1823e7ec&response_type=code&redirect_uri=${
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'PRODUCTION'
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
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PRODUCTION'
            ? 'https://spotifycards.vercel.app/'
            : 'http://localhost:3001/'
        }&scope=user-read-private%20user-read-email%20user-top-read&state=34fFs29kd09`
      );
    }
  }, []);

  return (
    <main className='relative flex min-h-screen flex-col items-center'>
      <section className='w-full min-h-screen relative bg-red-5000 flex flex-col  justify-center items-center '>
        <div className='absolute w-full h-full bg-secondary opacity-80 -z-10'></div>
        <Image
          src={'/background.jpg'}
          alt='Background Image'
          className='w-full h-full -z-20'
          layout='fill'
          objectFit='cover'
          objectPosition='center'
        />
        <div className='flex flex-col gap-10 items-center justify-center bg- rounded w-[80%] h-[60%]'>
          <h1 className='text-6xl font-bold text-center '>
            Welcome to Spotify Cards home!
          </h1>

          <button
            className='w-1/3 bg-accent text-white rounded-3xl p-2'
            onClick={createSession}
          >
            <h2 className='font-bold'>Get Started</h2>
          </button>
        </div>
      </section>
      <section className='w-full min-h-screen'>asda</section>
    </main>
  );
};

export default Home;
