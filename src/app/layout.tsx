import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bubble Popper',
  description: 'A relaxing bubble popping game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
