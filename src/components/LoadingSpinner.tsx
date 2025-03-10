export function LoadingSpinner() {
    return (
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-blue-500/30 animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-r-blue-500/70 animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-green-500/50 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }