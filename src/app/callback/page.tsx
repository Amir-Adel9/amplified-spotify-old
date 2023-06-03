'use client';
import React from 'react';

async function page(props: any) {
  console.log(props);
  const meData = await fetch('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      connection: 'close',
      Authorization: `Bearer BQClGuCyz8aK9mu4yt-Wt1OIJOCOT9ffNM-2PKjQF85whI0FuPc-7ZSgAyET3EIseGJG5DCcGE4JDDooaZO-l4WE08AiVp9mOzq9r0dRDM2yPkJXVs7Y70BYyK-F3L13Trlgxn4FsSnpQSqjoS-xSZxILf3A0byaz1Z4I1YfHcgTvuJ9tj6FcHp6rr8Y27YLYqMLwt9Hlrvj7zV-WjCFQTcVs7M0T4E`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.items);
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        image: item.album.images[0].url,
        preview: item.preview_url,
        albumName: item.album.name,
      }));
    });
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
}

export default page;
