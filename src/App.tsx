import React, { ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean; error: unknown}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-black uppercase italic mb-4">Something went wrong</h2>
            <p className="text-white/60 mb-8">Please refresh or check the console for errors.</p>
            <pre className="bg-[#111] p-4 rounded-xl text-xs text-red-400 overflow-auto mb-8 max-h-40">
              {this.state.error instanceof Error ? this.state.error.message : String(this.state.error)}
            </pre>
            <button onClick={() => window.location.reload()} className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-tighter">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Ashor's Fade App is running</h1>
          <p className="text-white/70">If you are seeing this, the React app is mounted correctly.</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
