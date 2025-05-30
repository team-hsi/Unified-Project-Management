import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/feature/shared/ui/card";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="absolute inset-0 bg-background/50 blur-sm" />
      </div>
      <h3 className="mt-4 font-medium text-muted-foreground">Loading...</h3>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong",
}: {
  message?: string;
}) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-4" />
        <h3 className="font-medium text-destructive mb-1">Error</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
