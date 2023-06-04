'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Params = {
  searchParams: {
    code: string;
    state: string;
  };
};

const Initializing = (props: Params) => {
  const { code } = props.searchParams;

  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [meData, setMeData] = useState([]);

  async function getAccessToken(code: string) {
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
        redirect_uri: `${
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'PRODUCTION'
            ? 'https://spotifycards.vercel.app/'
            : 'http://localhost:3001/'
        }`,
      }).toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log('errored', data);
          if (data.error_description === 'Invalid authorization code') {
            console.log('errored');
            router.push('/getting_started');
          }
        } else {
          console.log('data', data);
          localStorage.setItem(
            'accessToken',
            JSON.stringify(data.access_token)
          );
          return data.access_token;
        }
      })
      .catch((err) => {
        console.log('errored', err);
        if (
          err.status === 400 &&
          err.error_description === 'Invalid authorization code'
        ) {
          console.log('errored');
          router.push('/getting_started');
        }
        console.log(err);
      });
    return res;
  }

  const getMeData = async (accessToken: string) => {
    console.log('accessToken', accessToken);
    const res = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=30',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          artist: item.artists[0].name,
          image: item.album.images[0].url,
          preview: item.preview_url,
          albumName: item.album.name,
        }));
      });

    return res;
  };

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    if (!code || !sessionId) {
      setIsAuthorized(false);
      router.push('/getting_started');
    } else {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      getAccessToken(code)
        .then((token) => {
          if (!token) {
            console.log('errored');
            return;
          }
          getMeData(token).then((res) => {
            console.log('data', res);
            setMeData(res);
          });
        })
        .catch((err) => {
          console.log('errored', err);
          if (
            err.status === 400 &&
            err.error_description === 'Invalid authorization code'
          ) {
            console.log('errored');
            router.push('/getting_started');
          }
          console.log(err);
        });
    }
  }, [isAuthorized]);

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      {isAuthorized ? (
        <div className='flex flex-col justify-center items-center'>
          {/* <h1>Your Spotify account has been successfully integrated</h1>
          <h2>Now you can create your own Spotify Cards</h2>
          <h3>Click on the button below to start</h3>
          <button className='w-1/3 bg-black text-white rounded p-2'>
            <Link href='/profile'>
              <h2>Start</h2>
            </Link>
          </button> */}
          <div className='flex justify-center items-center flex-col gap-3  border border-accent border-y-0'>
            {meData.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className='flex justify-center items-center flex-col'
                >
                  <img
                    className='rounded-lg w-1/2'
                    src={item.image}
                    alt={item.name}
                  />
                  <h1 className='text-center'>{item.name}</h1>
                  <h2 className='text-center'>{item.artist}</h2>
                  <h3 className='text-center'>{item.albumName}</h3>
                  <audio
                    className='mt-2 fill-black'
                    controls
                    src={`${item.preview}`}
                  ></audio>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <h1>Redirecting...</h1>
      )}
    </div>
  );
};
export default Initializing;
