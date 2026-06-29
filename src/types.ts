export type ReadingStatus = 'to-read' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  author: string;
  firstPublishYear: number | null;
  coverId: number | null;
  status: ReadingStatus;
  rating: number | null;
  addedAt: number;
}

export interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export interface OpenLibraryResponse {
  docs: SearchResult[];
}

export type SortField = 'title' | 'author' | 'addedAt';
export type SortDir = 'asc' | 'desc';

export interface LibraryState {
  books: Book[];
  sortField: SortField;
  sortDir: SortDir;
  filterStatus: ReadingStatus | 'all';
}