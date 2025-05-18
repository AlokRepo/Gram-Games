
'use client';

import GameCard from '@/components/platform/GameCard';
import AmbientSoundControls from '@/components/platform/AmbientSoundControls';
import { PLATFORM_GAMES, PLATFORM_ICON, PLATFORM_TITLE, PLATFORM_SUBTITLE } from '@/lib/gameData';

export default function PlatformHomePage() {
  const PlatformIcon = PLATFORM_ICON;

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8">
      <header className="w-full max-w-4xl mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <PlatformIcon className="h-16 w-16 text-primary mr-4" />
          <div>
            <h1 className="text-5xl font-bold text-primary">{PLATFORM_TITLE}</h1>
            <p className="text-lg text-muted-foreground mt-1">{PLATFORM_SUBTITLE}</p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 flex flex-col gap-6">
          <AmbientSoundControls />
        </aside>

        <section className="md:col-span-2">
          <h2 className="text-3xl font-semibold text-foreground mb-6">Choose Your Calm</h2>
          {PLATFORM_GAMES.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PLATFORM_GAMES.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">No games available at the moment. Check back soon!</p>
            </div>
          )}
        </section>
      </div>
      
      <footer className="w-full max-w-4xl mt-16 pt-8 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {PLATFORM_TITLE}. Find your moment of peace.
        </p>
      </footer>
    </main>
  );
}
