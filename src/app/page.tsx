import BubbleGame from '@/components/bubble-popper/BubbleGame';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-2 sm:p-4">
      <BubbleGame />
    </main>
  );
}
