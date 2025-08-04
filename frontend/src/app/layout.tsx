import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Header from '@/../components/ui/Header';
import Footer from '@/../components/ui/Footer';
import '@/styles/globals.css';
import { NextAuthProvider } from '@/../components/auth/NextAuthProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Feedback Tracker',
  description: 'Track and manage feedback with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}