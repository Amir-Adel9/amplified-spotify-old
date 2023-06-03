import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') as string;
  console.log('qqqqq', q);

  const topTracks = await fetch('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      Authorization: `Bearer ${q}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log('err', err));
  const data = await topTracks.json();

  return NextResponse.json({ data });
}
