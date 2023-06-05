import './globals.css';
import { Inter, Kanit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const kanit = Kanit({
  subsets: ['latin'],
  variable: '--font-kanit',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'Amplified Spotify',
  description: 'Amplified Spotify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${inter.variable} ${kanit.variable}`}>
      <body>
        <header className='fixed w-full h-[4.5rem] bg-secondary flex justify-center items-center z-50'>
          <h1 className='text-4xl font-bold text-white'>Amplified Spotify</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
