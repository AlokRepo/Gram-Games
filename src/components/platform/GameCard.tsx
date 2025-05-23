
'use client';

import type { GameMeta } from '@/lib/gameData';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GAME_PREVIEW_IMAGES } from '@/lib/imagePaths';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: GameMeta;
}

export default function GameCard({ game }: GameCardProps) {
  const IconComponent = game.icon;
  const placeholderImage = `https://placehold.co/600x300.png`;
  const gameImageSrc = GAME_PREVIEW_IMAGES[game.id] || placeholderImage;

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300", game.color || 'bg-card')}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-2">
          <IconComponent className="h-8 w-8 text-primary" />
          <CardTitle className="text-xl font-semibold text-foreground">{game.name}</CardTitle>
        </div>
        <Image
          src={gameImageSrc}
          alt={gameImageSrc === placeholderImage ? `${game.name} placeholder image` : `${game.name} preview`}
          width={600}
          height={300}
          className="rounded-md object-cover aspect-video"
          data-ai-hint={game.dataAiHint || game.name.toLowerCase()}
          priority={game.id === 'bubble-popper'} // Example: prioritize first game image, adjust as needed
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-muted-foreground">{game.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={game.route} passHref legacyBehavior>
          <Button className="w-full" variant="default">
            Play Game <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
