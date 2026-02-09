
import React, { useState, useCallback } from 'react';
import { ViewState, MusicTrack } from './types';
import { parseMusicFile, getCategorizedFeatures } from './utils';
import Intro from './components/Intro';
import MusicGrid from './components/MusicGrid';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Background from './components/Background';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('intro');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleEnter = useCallback(() => {
    setView('main');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const musicFiles = (Array.from(files) as File[]).filter(file => 
      file.name.toLowerCase().endsWith('.wav')
    );

    const parsedTracks = musicFiles.map(parseMusicFile);
    setTracks(parsedTracks);
    setActiveCategory('All');
    setSearchQuery('');
  };

  const resetFilter = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  const handleStop = () => {
    setCurrentTrack(null);
  };

  // Combined filtering: Category + Search Query
  const filteredTracks = tracks.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.features.includes(activeCategory);
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const { instruments, moods } = getCategorizedFeatures(tracks);

  const handleNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx < tracks.length - 1) {
      setCurrentTrack(tracks[idx + 1]);
    } else {
      setCurrentTrack(tracks[0]);
    }
  };

  const handlePrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx > 0) {
      setCurrentTrack(tracks[idx - 1]);
    } else {
      setCurrentTrack(tracks[tracks.length - 1]);
    }
  };

  return (
    <>
      <Background isIntro={view === 'intro'} />
      
      {view === 'intro' ? (
        <Intro onEnter={handleEnter} />
      ) : (
        <div className="min-h-screen flex flex-col fade-in relative z-10">
          {/* Header */}
          <header className="px-8 py-8 flex justify-between items-center border-b border-black/5 shrink-0 z-[60] glass-panel">
            <div className="flex items-end gap-12">
              <button 
                onClick={resetFilter}
                className="text-left group outline-none transition-all"
                aria-label="Reset to All Works"
              >
                <h1 className="serif text-3xl tracking-tight font-light uppercase group-hover:opacity-60 transition-opacity">XR Music</h1>
                <p className="text-[9px] tracking-[0.2em] uppercase mt-1 opacity-50">XR MUSIC ARCHIVES</p>
              </button>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Minimalist Search Bar - Repositioned to the left of Import button */}
              <div className="relative hidden md:block">
                <input 
                  type="text"
                  placeholder="SEARCH TITLES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-b border-black/10 focus:border-black/40 outline-none px-0 py-1 text-[10px] tracking-[0.2em] uppercase w-48 lg:w-64 transition-all duration-500 placeholder:opacity-30"
                />
                <svg className="absolute right-0 bottom-2 w-3 h-3 opacity-20 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>

              <label className="cursor-pointer border border-black/10 bg-white/40 px-5 py-1.5 text-[10px] uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-500 rounded-full backdrop-blur-md shrink-0">
                Import Archive
                <input 
                  type="file" 
                  className="hidden" 
                  // @ts-ignore
                  webkitdirectory="" 
                  directory="" 
                  multiple 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </header>

          <div className="flex flex-1 relative overflow-hidden">
            {/* Sidebar */}
            <Sidebar 
              instruments={instruments}
              moods={moods}
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
              totalCount={tracks.length}
            />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8 pb-48">
              {tracks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <div className="w-px h-24 bg-[#1A1A1A] mb-8"></div>
                  <p className="serif italic text-2xl">Select an archive folder to begin</p>
                </div>
              ) : filteredTracks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center pt-20">
                   <p className="serif italic text-xl">No tracks found matching "{searchQuery}"</p>
                </div>
              ) : (
                <MusicGrid 
                  tracks={filteredTracks} 
                  onPlay={setCurrentTrack} 
                  onStop={handleStop}
                  currentTrackId={currentTrack?.id}
                />
              )}
            </main>
          </div>

          {/* Persistent Player Bar */}
          <Player 
            track={currentTrack} 
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      )}
    </>
  );
};

export default App;
