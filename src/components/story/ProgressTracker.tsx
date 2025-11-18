'use client';

interface ProgressTrackerProps {
  progress: number;
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-black/10 z-50">
      <div
        className="h-full bg-black transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

