
export interface MusicTrack {
  id: string;
  fileName: string;
  title: string;
  features: string[];
  url: string;
  blob: File;
  gradient: string;
}

export type ViewState = 'intro' | 'main';
