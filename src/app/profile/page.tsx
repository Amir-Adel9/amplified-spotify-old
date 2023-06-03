'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

async function getAccessToken(code: string) {
  const res = await fetch(`/api/authorize?code=${code}`, {});

  const data = await res.json();
  console.log('data', data);
  const accessToken = data.accessToken;

  localStorage.setItem('accessToken', JSON.stringify(accessToken));

  console.log(accessToken);
  return accessToken;
}

async function getMeData(accessToken: string) {
  console.log('accessToken', accessToken);
  const res = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
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
    })
    .catch((err) => console.log(err));

  return res;
}

const ProfilePage = async () => {
  const [meData, setMeData] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      getMeData(accessToken).then((res) => {
        setMeData(res);
      });
    }
  }, []);
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <div>
        <div className='flex justify-center items-center flex-col gap-3 bg-[#ffffff] border border-black'>
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
    </div>
  );
};

export default ProfilePage;
