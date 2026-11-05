export interface Poster {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
  tags?: string[];
  aspectRatio?: string;
  created: number;
  assetId?: string;
  fileSize?: string;
  author?: string;
  likes?: number;
  featured?: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'likes';
export type ViewMode = 'grid' | 'compact' | 'featured';
