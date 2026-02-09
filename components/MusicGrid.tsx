
import React, { useRef } from 'react';
import { MusicTrack } from '../types';

interface MusicGridProps {
  tracks: MusicTrack[];
  onPlay: (track: MusicTrack) => void;
  onStop: () => void;
  currentTrackId?: string;
}

const MusicGrid: React.FC<MusicGridProps> = ({ tracks, onPlay, onStop, currentTrackId }) => {
  const clickTimer = useRef<number | null>(null);

  const handleCardClick = (track: MusicTrack) => {
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
    } else {
      clickTimer.current = window.setTimeout(() => {
        onPlay(track);
        clickTimer.current = null;
      }, 250);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-12">
      {tracks.map((track) => (
        <div key={track.id} className="group">
          <div 
            className="relative aspect-square mb-5 overflow-hidden rounded-2xl bg-black/[0.03] border border-black/[0.03] shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer select-none"
            onClick={() => handleCardClick(track)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
          >
            <div 
              style={{ background: track.gradient }} 
              className="w-full h-full transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${currentTrackId === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center shadow-2xl">
                {currentTrackId === track.id ? (
                  <div className="flex items-center gap-1">
                     <div className="w-1 h-4 bg-white animate-pulse"></div>
                     <div className="w-1 h-6 bg-white animate-pulse"></div>
                     <div className="w-1 h-4 bg-white animate-pulse"></div>
                  </div>
                ) : (
                  <svg className="w-5 h-5 text-white fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
            </div>
          </div>
          <div className="px-1 space-y-1">
            <h3 className="serif text-lg font-light tracking-wide truncate">{track.title}</h3>
            <p className="text-[9px] tracking-[0.15em] opacity-40 uppercase truncate font-medium">
              {track.features.join(' / ') || 'Archive'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicGrid;
