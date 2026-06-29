import { useReducer, useEffect } from 'react';
import type { Book, ReadingStatus, SortField, SortDir, LibraryState } from './types';

type Action =
  | { type: 'ADD_BOOK'; book: Book }
  | { type: 'DELETE_BOOK'; id: string }
  | { type: 'SET_STATUS'; id: string; status: ReadingStatus }
  | { type: 'SET_RATING'; id: string; rating: number }
  | { type: 'SET_SORT'; field: SortField; dir: SortDir }
  | { type: 'SET_FILTER'; status: ReadingStatus | 'all' }
  | { type: 'LOAD'; state: LibraryState };

const defaultState: LibraryState = {
  books: [],
  sortField: 'addedAt',
  sortDir: 'desc',
  filterStatus: 'all',
};

function reducer(state: LibraryState, action: Action): LibraryState {
  switch (action.type) {
    case 'ADD_BOOK':
      if (state.books.some((b) => b.id === action.book.id)) return state;
      return { ...state, books: [...state.books, action.book] };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter((b) => b.id !== action.id) };
    case 'SET_STATUS': {
      const next = action.status;
      return {
        ...state,
        books: state.books.map((b) =>
          b.id === action.id
            ? { ...b, status: next, rating: next !== 'finished' ? null : b.rating }
            : b
        ),
      };
    }
    case 'SET_RATING':
      return {
        ...state,
        books: state.books.map((b) =>
          b.id === action.id ? { ...b, rating: action.rating } : b
        ),
      };
    case 'SET_SORT':
      return { ...state, sortField: action.field, sortDir: action.dir };
    case 'SET_FILTER':
      return { ...state, filterStatus: action.status };
    case 'LOAD':
      return action.state;
    default:
      return state;
  }
}

const STORAGE_KEY = 'reading-tracker-library';

export function useLibrary() {
  const [state, dispatch] = useReducer(reducer, defaultState, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      return { ...defaultState, ...JSON.parse(raw) };
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}