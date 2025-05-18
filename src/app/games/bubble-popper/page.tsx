
'use client';
import BubbleGame from '@/components/bubble-popper/BubbleGame';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PLATFORM_GAMES } from '@/lib/gameData';

export default function BubblePopperPage() {
  const gameMeta = PLATFORM_GAMES.find(g => g.id === 'bubble-popper');

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background p-2 sm:p-4 pt-10">
      <Card className="w-full max-w-xl mb-6 shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
              </Button>
            </Link>
            {gameMeta && (
              <h1 className="text-2xl font-semibold text-primary">{gameMeta.name}</h1>
            )}
          </div>
           {gameMeta && (
            <p className="text-sm text-muted-foreground mb-4">{gameMeta.longDescription}</p>
           )}
        </CardContent>
      </Card>
      <BubbleGame />
    </main>
  );
}
