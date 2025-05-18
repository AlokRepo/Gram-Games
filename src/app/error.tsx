// @ts-nocheck : TODO, fix types
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
      <h1 className="text-4xl font-bold text-destructive mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-foreground mb-6">
        We encountered an unexpected issue. Please try again.
      </p>
      {error?.message && (
        <p className="text-sm text-muted-foreground mb-6">
          Error details: {error.message}
        </p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        variant="default"
        size="lg"
      >
        Try again
      </Button>
    </div>
  );
}
