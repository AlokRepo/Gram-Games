
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PLATFORM_TITLE, PLATFORM_SUBTITLE } from '@/lib/gameData';
import FallingLeavesBackground from '@/components/platform/FallingLeavesBackground';


const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: PLATFORM_TITLE,
  description: PLATFORM_SUBTITLE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans antialiased bg-background text-foreground`}>
        <FallingLeavesBackground />
        {/* Children will render here, naturally above the z-indexed background */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
