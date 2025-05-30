"use client";

import { Button } from "@/feature/shared/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <Button
        variant="destructive"
        className="mt-4 rounded-md  px-4 py-2 text-sm  transition-colors"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </main>
  );
}
