'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Params = {
  searchParams: {
    code: string;
    state: string;
  };
};

type TrackData = {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
    href: string;
  }[];
  album: {
    id: string;
    name: string;
    album_type: string;
    artists: {
      id: string;
      name: string;
      href: string;
    }[];
    images: {
      url: string;
      width: number;
      height: number;
    }[];
    preview: string;
  };
  available_markets: string[];
  duration_ms: number;
  explicit: boolean;
  href: string;
  is_local: boolean;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
};

type UserData = {
  id: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  images: {
    url: string;
    width: number;
    height: number;
  }[];
  product: string;
  type: string;
  uri: string;
  topTracks: TrackData[];
};

const Initializing = (props: Params) => {
  const { code } = props.searchParams;

  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState<UserData | undefined>();

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
            ? 'https://amplified-spotify.vercel.app/'
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

  const getUserData = async (accessToken: string) => {
    const info = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        return data;
      });
    const topTracks = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=30',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        return data.items.map((item: TrackData) => ({
          id: item.id,
          name: item.name,
          artists: item.artists,
          album: item.album,
          preview_url: item.preview_url,
        }));
      });

    return {
      id: info.id,
      display_name: info.display_name,
      email: info.email,
      external_urls: info.external_urls,
      followers: info.followers,
      href: info.href,
      images: info.images,
      product: info.product,
      type: info.type,
      uri: info.uri,
      topTracks: topTracks,
    } as UserData;
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
            console.log('no token');
            return;
          }
          getUserData(token).then((res) => {
            setUserData(res);
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

  useEffect(() => {
    console.log('userData', userData);
  }, [userData]);

  return (
    <main className='w-full min-h-screen flex flex-col justify-center items-center'>
      {isAuthorized ? (
        <>
          <div className='flex flex-col justify-center items-center'>
            <div></div>
            <h1 className='text-3xl font-bold'>Profile</h1>
            <div className='flex justify-center items-center flex-col'></div>
            <Image
              className='rounded-full'
              src={userData?.images[0].url as string}
              alt={userData?.display_name as string}
              width={128}
              height={128}
            />
            <h1 className='text-center'>{userData?.display_name}</h1>
            {/* <h2 className='text-center'>{userData?.email}</h2> */}
            <h3 className='text-center'>{userData?.product}</h3>
          </div>
          <div className='w-full flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold'>Top Tracks</h1>
            <div
              className='flex gap-3 overflow-x-scroll w-[80%] border-accent border-2 border-x-0 '
              style={{
                scrollBehavior: 'smooth',
                scrollSnapType: 'x mandatory',
                scrollSnapAlign: 'start',
                scrollPadding: '0 10px',
              }}
            >
              {userData?.topTracks.map((track) => {
                return (
                  <div
                    key={track.id}
                    className='flex justify-center items-center flex-col'
                  >
                    <Image
                      className='rounded-lg w-1/2'
                      src={track.album.images[0].url}
                      alt={track.name}
                      width={track.album.images[0].width * 2}
                      height={track.album.images[0].height * 2}
                    />
                    <h2 className='text-center'>{track.artists[0].name}</h2>
                    <h1 className='text-center'>{track.name}</h1>
                    <h3 className='text-center'>{track.album.name}</h3>
                    <audio
                      className='mt-2 fill-black'
                      controls
                      src={`${track.preview_url}`}
                    ></audio>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <h1>Redirecting...</h1>
      )}
    </main>
  );
};
export default Initializing;
