'use client';

import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useReadingProgress } from '@/hooks/useReadingProgress';

interface AudioPlayerProps {
  audioUrl: string;
  storyId: string;
}

export default function AudioPlayer({ audioUrl, storyId }: AudioPlayerProps) {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    togglePlayPause,
    skip,
    changeSpeed,
    seek,
  } = useAudioPlayer(audioUrl);
  
  const { updateProgress } = useReadingProgress(storyId);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && duration > 0) {
      const percentComplete = (currentTime / duration) * 100;
      updateProgress(percentComplete, false, currentTime);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 mb-12">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 flex items-center justify-center bg-white text-black hover:bg-white/90 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        
        <button
          onClick={() => skip(-15)}
          className="text-white/60 hover:text-white text-sm font-medium transition-colors"
          aria-label="Skip back 15 seconds"
        >
          ⏪ 15s
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <div className="flex justify-between text-xs text-white/50 mt-2 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <button
          onClick={() => skip(15)}
          className="text-white/60 hover:text-white text-sm font-medium transition-colors"
          aria-label="Skip forward 15 seconds"
        >
          15s ⏩
        </button>
        
        <button
          onClick={changeSpeed}
          className="text-sm text-white/60 hover:text-white min-w-[3rem] font-medium transition-colors"
          aria-label="Change playback speed"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
}

