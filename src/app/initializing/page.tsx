'use client';
import Link from 'next/link';

type Params = {
  searchParams: {
    code: string;
    state: string;
  };
};

const Initializing = async (props: Params) => {
  const { code } = props.searchParams;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        '680c63260c134834b22df08c1823e7ec' +
          ':' +
          '0dcb6629725a4f1bb89da8ee994ed649'
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: `${code}`,
      redirect_uri: 'http://localhost:3001/initializing',
    }).toString(),
  }).then((res) => res.json());

  console.log('res', res);

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <h1>Your Spotify account has been successfully integrated</h1>
        <h2>Now you can create your own Spotify Cards</h2>
        <h3>Click on the button below to start</h3>
        <button className='w-1/3 bg-black text-white rounded p-2'>
          <Link href='/profile'>
            <h2>Start</h2>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Initializing;
