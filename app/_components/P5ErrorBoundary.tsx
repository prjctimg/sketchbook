'use client';

import React, { Component, type ReactNode } from 'react';

interface P5ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface P5ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class P5ErrorBoundary extends Component<P5ErrorBoundaryProps, P5ErrorBoundaryState> {
  constructor(props: P5ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[P5ErrorBoundary] Sketch error:', error.message, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="w-full h-full flex items-center justify-center bg-surface-container-highest rounded-xl">
          <div className="text-center p-6">
            <span className="font-mono-xs uppercase tracking-widest opacity-40 block mb-2">
              Sketch failed to load
            </span>
            <span className="font-mono-xs opacity-30 block">
              {this.state.error?.message || 'Unknown error'}
            </span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
