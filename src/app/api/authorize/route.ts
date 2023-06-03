import { NextRequest, NextResponse } from 'next/server';

// async function getAccessToken(code: string) {
//   const accessToken = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Authorization: `Basic ${Buffer.from(
//         '680c63260c134834b22df08c1823e7ec' +
//           ':' +
//           '0dcb6629725a4f1bb89da8ee994ed649'
//       ).toString('base64')}`,
//     },
//     body: new URLSearchParams({
//       grant_type: 'client_credentials',
//       code: `${code}`,
//       redirect_uri: 'http://localhost:3001/profile',
//     }).toString(),
//   });

//   const data = await accessToken.json();

//   return data.access_token;
// }

// async function getTopTracks(accessToken: string) {
//   const topTracks = await fetch('https://api.spotify.com/v1/me/top/tracks', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })
//     .then((res) => res.json())
//     .catch((err) => console.log('err', err));
//   const data = await topTracks.json();

//   return data.items;
// }

// async function fetchData(code: string) {
//   const accessToken = await getAccessToken(code);

//   const topTracks = await getTopTracks(accessToken);
//   return topTracks;
// }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code') as string;

  const accessToken = await fetch('https://accounts.spotify.com/api/token', {
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
      grant_type: 'client_credentials',
      code: `${code}`,
      redirect_uri: 'http://localhost:3001/profile',
    }).toString(),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('number', '1');
      return data.access_token;
    });

  console.log('number', '2');
  console.log('1st', accessToken);

  return NextResponse.json({ accessToken });
}
