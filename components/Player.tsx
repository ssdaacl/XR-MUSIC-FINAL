
import React, { useState, useRef, useEffect } from 'react';
import { MusicTrack } from '../types';

interface PlayerProps {
  track: MusicTrack | null;
  onNext: () => void;
  onPrev: () => void;
}

const Player: React.FC<PlayerProps> = ({ track, onNext, onPrev }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay context", e));
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [track]);

  const togglePlay = () => {
    if (audioRef.current && track) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] bg-white/90 backdrop-blur-2xl border border-white/40 shadow-2xl px-8 py-5 z-[9999] rounded-[2rem]">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {track && <audio ref={audioRef} src={track.url} onTimeUpdate={handleTimeUpdate} onEnded={onNext} />}
        <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-xl" style={track ? { background: track.gradient } : { background: '#eee' }} />
          <div className="overflow-hidden">
            <h4 className="serif text-lg leading-tight truncate">{track ? track.title : 'No track selected'}</h4>
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button onClick={onPrev} disabled={!track} className="opacity-40 hover:opacity-100 disabled:opacity-10">Prev</button>
            <button onClick={togglePlay} disabled={!track} className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-20">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={onNext} disabled={!track} className="opacity-40 hover:opacity-100 disabled:opacity-10">Next</button>
          </div>
          <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
            <div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="hidden md:flex w-1/4 justify-end">
          {track && <a href={track.url} download={track.fileName} className="text-[10px] uppercase tracking-widest border border-black/10 px-4 py-2 rounded-full">Save WAV</a>}
        </div>
      </div>
    </div>
  );
};

export default Player;
