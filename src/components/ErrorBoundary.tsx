import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (Component as any) {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    (this as any).setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if ((this as any).state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-destructive/10 p-6 rounded-full mb-6">
            <AlertCircle size={48} className="text-destructive" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground italic font-serif mb-8 max-w-xs">
            We encountered an unexpected error. Don't worry, your memories are safe.
          </p>
          <div className="bg-white p-4 rounded-xl border border-border mb-8 w-full max-w-sm overflow-auto max-h-32 text-left">
            <code className="text-xs text-destructive font-mono">
              {(this as any).state.error?.message || "Unknown error"}
            </code>
          </div>
          <Button 
            onClick={this.handleReset}
            className="rounded-xl h-12 px-8 font-serif"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Restart App
          </Button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
