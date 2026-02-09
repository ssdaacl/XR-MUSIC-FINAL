
import { MusicTrack } from './types';

const GRADIENTS = [
  'linear-gradient(135deg, #A8A297 0%, #C4BDB3 100%)', // Muted Deep Taupe
  'linear-gradient(135deg, #9BA5A4 0%, #BCC4C3 100%)', // Stormy Slate
  'linear-gradient(135deg, #A59B9B 0%, #C4B8B8 100%)', // Dusty Rose Deep
  'linear-gradient(135deg, #9BA5A3 0%, #B8C4C2 100%)', // Deep Sage
  'linear-gradient(135deg, #9B9FA5 0%, #B8BDC4 100%)', // Muted Denim
  'linear-gradient(135deg, #A5A29B 0%, #C4C1B8 100%)', // Aged Parchment
  'linear-gradient(135deg, #9FA2A8 0%, #BDC0C7 100%)', // Steel Grey
  'linear-gradient(135deg, #A89B9B 0%, #C7B8B8 100%)', // Terra Grey
  'linear-gradient(135deg, #9BA8A1 0%, #B8C7BF 100%)', // Moss Grey
  'linear-gradient(135deg, #9E9E9E 0%, #BCBCBC 100%)', // Deep Concrete
  'linear-gradient(135deg, #9FA2A8 0%, #BDC0C7 100%)', // Shadow Blue
  'linear-gradient(135deg, #AFA89F 0%, #CDC7BC 100%)', // Warm Stone
];

const INSTRUMENTS_MASTER = ['피아노', '비올라', '첼로', '드럼', '베이스', '기타'];

const cleanFeature = (f: string): string => {
  let cleaned = f.trim();
  // Removed the regex that was stripping (n) suffixes to ensure numbering is preserved
  return cleaned;
};

const shouldExclude = (f: string): boolean => {
  const upper = f.toUpperCase();
  if (upper === '120BPM') return true;
  if (upper.includes('SN')) return true;
  return false;
};

const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

export const parseMusicFile = (file: File): MusicTrack => {
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  
  // Split by underscore to separate Title from Features
  const parts = nameWithoutExt.split('_');
  
  // The first part is the title. If it contains (1), (2), it will be preserved here.
  const title = parts[0] || 'Untitled';
  
  const rawFeatures = parts.slice(1);
  
  const features = Array.from(new Set(
    rawFeatures
      .map(cleanFeature)
      .filter(f => f !== "" && !shouldExclude(f))
  ));
  
  const hash = stringToHash(file.name);
  const gradient = GRADIENTS[hash % GRADIENTS.length];

  return {
    id: Math.random().toString(36).substr(2, 9),
    fileName: file.name,
    title,
    features,
    url: URL.createObjectURL(file),
    blob: file,
    gradient
  };
};

export const getCategorizedFeatures = (tracks: MusicTrack[]) => {
  const allFeaturesAcrossTracks = tracks.flatMap(t => t.features);
  
  const presentInstruments = INSTRUMENTS_MASTER.filter(inst => 
    allFeaturesAcrossTracks.includes(inst)
  );
  
  const moodCounts: Record<string, number> = {};
  allFeaturesAcrossTracks.forEach(feat => {
    if (!INSTRUMENTS_MASTER.includes(feat)) {
      moodCounts[feat] = (moodCounts[feat] || 0) + 1;
    }
  });
  
  const moods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  
  return { instruments: presentInstruments, moods };
};
