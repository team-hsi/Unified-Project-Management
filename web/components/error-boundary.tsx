"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorLogger } from "@/lib/errors/error-logger";
import { AppError } from "@/lib/errors/app-error";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  showRetry?: boolean;
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log the error
    errorLogger.log(error, {
      path: window.location.pathname,
      componentStack: errorInfo.componentStack,
    });

    // Show toast based on error type
    if (error instanceof AppError) {
      toast.error(error.message, {
        description: `Error code: ${error.code}`,
      });
    } else {
      toast.error("An unexpected error occurred", {
        description: error.message,
      });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  private handleGoHome = () => {
    const router = useRouter();
    router.push("/");
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground mt-2">
              {this.state.error?.message}
            </p>
            {this.state.error instanceof AppError && (
              <p className="text-sm text-muted-foreground mt-1">
                Error code: {this.state.error.code}
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            {this.props.showRetry !== false && (
              <Button onClick={this.handleReset}>Try again</Button>
            )}
            {this.props.showHomeButton && (
              <Button variant="outline" onClick={this.handleGoHome}>
                Go to Home
              </Button>
            )}
          </div>

          {process.env.NODE_ENV === "development" && this.state.errorInfo && (
            <details className="mt-4 w-full max-w-2xl">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error Details
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto text-sm">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
