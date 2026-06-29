import { useState, useEffect, useMemo } from 'react';
import type { Book, SearchResult, ReadingStatus, SortField, SortDir } from './types';
import { useLibrary } from './useLibrary';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import StatsBar from './components/StatsBar';
import LibraryControls from './components/LibraryControls';