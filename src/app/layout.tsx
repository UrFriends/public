import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UrFriends!',
  description: 'Consciously build and maintain powerful connections',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
