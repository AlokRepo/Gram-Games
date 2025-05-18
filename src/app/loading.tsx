import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex justify-around">
            <Skeleton className="h-28 w-36 rounded-lg" />
            <Skeleton className="h-28 w-36 rounded-lg" />
        </div>
        <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-36 rounded-md" />
            <Skeleton className="h-12 w-24 rounded-md" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4 mx-auto rounded-md" />
      </div>
    </div>
  );
}
