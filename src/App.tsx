import { useState, useEffect, useMemo } from 'react';
import type { Book, SearchResult, ReadingStatus, SortField, SortDir } from './types';
import { useLibrary } from './useLibrary';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import StatsBar from './components/StatsBar';
import LibraryControls from './components/LibraryControls';

function sortBooks(books: Book[], field: SortField, dir: SortDir): Book[] {
  return [...books].sort((a, b) => {
    let cmp = 0;
    if (field === 'title') cmp = a.title.localeCompare(b.title);
    else if (field === 'author') cmp = a.author.localeCompare(b.author);
    else cmp = a.addedAt - b.addedAt;
    return dir === 'asc' ? cmp : -cmp;
  });
}