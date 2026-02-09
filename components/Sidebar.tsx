
import React from 'react';

interface SidebarProps {
  instruments: string[];
  moods: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  totalCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ instruments, moods, activeCategory, onSelectCategory, totalCount }) => {
  return (
    <aside className="w-64 border-r border-black/5 h-full overflow-y-auto p-8 glass-panel shrink-0 hidden md:block">
      <div className="mb-10">
        <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold mb-6">Archive</h2>
        <ul className="space-y-4">
          <li>
            <button 
              onClick={() => onSelectCategory('All')}
              className={`text-sm tracking-wide transition-all duration-300 flex items-center gap-3 w-full ${activeCategory === 'All' ? 'opacity-100 font-medium' : 'opacity-30 hover:opacity-100'}`}
            >
              <span className={`w-1 h-1 rounded-full bg-[#1A1A1A] ${activeCategory === 'All' ? 'scale-100' : 'scale-0'} transition-transform`}></span>
              ALL WORKS <span className="text-[9px] ml-auto font-normal opacity-40">({totalCount})</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold mb-6">Instruments</h2>
        <ul className="space-y-4">
          {instruments.length === 0 && <li className="text-[10px] opacity-20 italic">No instruments found</li>}
          {instruments.map((cat) => (
            <li key={cat}>
              <button 
                onClick={() => onSelectCategory(cat)}
                className={`text-sm tracking-wide transition-all duration-300 flex items-center gap-3 text-left w-full ${activeCategory === cat ? 'opacity-100 font-medium' : 'opacity-30 hover:opacity-100'}`}
              >
                <span className={`w-1 h-1 rounded-full bg-[#1A1A1A] ${activeCategory === cat ? 'scale-100' : 'scale-0'} transition-transform`}></span>
                {cat.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-bold mb-6">Mood & Features</h2>
        <ul className="space-y-4">
          {moods.length === 0 && <li className="text-[10px] opacity-20 italic">No features found</li>}
          {moods.map((cat) => (
            <li key={cat}>
              <button 
                onClick={() => onSelectCategory(cat)}
                className={`text-sm tracking-wide transition-all duration-300 flex items-center gap-3 text-left w-full ${activeCategory === cat ? 'opacity-100 font-medium' : 'opacity-30 hover:opacity-100'}`}
              >
                <span className={`w-1 h-1 rounded-full bg-[#1A1A1A] ${activeCategory === cat ? 'scale-100' : 'scale-0'} transition-transform`}></span>
                {cat.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
