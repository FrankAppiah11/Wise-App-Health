import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen bg-[#6B54A7] flex flex-col items-center justify-center p-8 text-white font-sans">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full space-y-4">
            <h1 className="text-xl font-black text-white">Something went wrong</h1>
            <p className="text-sm text-white/90 break-words">{this.state.error.message}</p>
            <pre className="text-xs text-white/70 overflow-auto max-h-40 bg-black/20 p-3 rounded-xl">
              {this.state.error.stack}
            </pre>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full py-3 bg-white text-[#6B54A7] font-black rounded-2xl hover:opacity-90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
