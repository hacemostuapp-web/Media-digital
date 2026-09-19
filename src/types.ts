export type PhotoStatus = 'all' | 'edited' | 'raw' | 'exported' | 'in_progress';

export interface StudioPhoto {
  id: string;
  filename: string;
  dimensions: string;
  filesize: string;
  status: 'edited' | 'raw' | 'in_progress' | 'exported';
  badgeText: string;
  badgeType: 'emerald' | 'amber' | 'neutral';
  timeAgo: string;
  thumbnailUrl: string;
  rawImageUrl?: string;
  isolatedImageUrl?: string;
  altText: string;
  presetApplied?: string;
  contrast: number; // e.g. -50 to +50
  saturation: number; // e.g. -50 to +50
  brightness: number; // e.g. 0 to 20
  isBgRemoved: boolean;
  selectedBackdrop: 'white' | 'neutral' | 'beige' | 'grey' | 'transparent';
  isLightingImproved: boolean;
  platformPreset?: string;
  exportFormat?: 'jpg' | 'png' | 'webp';
  exportQuality?: number;
}

export type ActiveScreen = 'dashboard' | 'editor' | 'export' | 'auth' | 'catalog' | 'presets' | 'settings';

export interface UserProfile {
  name: string;
  email: string;
  storeName: string;
  tier: string;
  avatarUrl: string;
  usedCredits: number;
  totalCredits: number;
  renewsInDays: number;
}
