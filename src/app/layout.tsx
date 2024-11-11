import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const roboto_mono = Montserrat({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto_mono.variable} antialiased`}>
        <div className="min-h-screen w-full bg-background grid grid-rows-[auto_1fr_auto]">
          <ReactQueryProvider>
            <Nav />
            <main className="flex">{children}</main>
            <Toaster />
            <Footer />
          </ReactQueryProvider>
        </div>
      </body>
    </html>
  );
}
