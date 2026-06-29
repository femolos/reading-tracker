import { useState, useEffect, useMemo } from 'react';
import type { Book, SearchResult, ReadingStatus, SortField, SortDir } from './types';
import { useLibrary } from './useLibrary';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import StatsBar from './components/StatsBar';
import LibraryControls from './components/LibraryControls';

const THEME_KEY = 'reading-tracker-theme';

function sortBooks(books: Book[], field: SortField, dir: SortDir): Book[] {
  return [...books].sort((a, b) => {
    let cmp = 0;
    if (field === 'title') cmp = a.title.localeCompare(b.title);
    else if (field === 'author') cmp = a.author.localeCompare(b.author);
    else cmp = a.addedAt - b.addedAt;
    return dir === 'asc' ? cmp : -cmp;
  });
}


export default function App() {
  const { state, dispatch } = useLibrary();

  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem(THEME_KEY) === 'dark'; }
    catch { return false; }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  function handleAdd(result: SearchResult) {
    const book: Book = {
      id: result.key,
      title: result.title,
      author: result.author_name?.[0] ?? 'Unknown author',
      firstPublishYear: result.first_publish_year ?? null,
      coverId: result.cover_i ?? null,
      status: 'to-read',
      rating: null,
      addedAt: Date.now(),
    };
    dispatch({ type: 'ADD_BOOK', book });
  }

  const addedIds = useMemo(() => new Set(state.books.map((b) => b.id)), [state.books]);

  const displayedBooks = useMemo(() => {
    const filtered =
      state.filterStatus === 'all'
        ? state.books
        : state.books.filter((b) => b.status === state.filterStatus);
    return sortBooks(filtered, state.sortField, state.sortDir);
  }, [state.books, state.filterStatus, state.sortField, state.sortDir]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              ReadingTracker
            </h1>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Find a Book
          </h2>
          <SearchBar onAdd={handleAdd} addedIds={addedIds} />
        </section>

        {state.books.length > 0 && (
          <section>
            <StatsBar books={state.books} />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            My Library
            {state.books.length > 0 && (
              <span className="ml-2 text-slate-400 dark:text-slate-500 font-normal normal-case">
                ({state.books.length} {state.books.length === 1 ? 'book' : 'books'})
              </span>
            )}
          </h2>

          {state.books.length > 0 && (
            <LibraryControls
              filterStatus={state.filterStatus}
              sortField={state.sortField}
              sortDir={state.sortDir}
              onFilter={(status) => dispatch({ type: 'SET_FILTER', status })}
              onSort={(field: SortField, dir: SortDir) => dispatch({ type: 'SET_SORT', field, dir })}
            />
          )}

          {state.books.length === 0 ? (
            <EmptyLibrary />
          ) : displayedBooks.length === 0 ? (
            <EmptyFilter
              status={state.filterStatus as ReadingStatus}
              onClear={() => dispatch({ type: 'SET_FILTER', status: 'all' })}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onStatusChange={(id, status) => dispatch({ type: 'SET_STATUS', id, status })}
                  onRatingChange={(id, rating) => dispatch({ type: 'SET_RATING', id, rating })}
                  onDelete={(id) => dispatch({ type: 'DELETE_BOOK', id })}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function EmptyLibrary() {
  return (
    <div className="py-20 text-center space-y-3">
      <p className="text-5xl">🔍</p>
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Your library is empty</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Search for a book above and add it to get started.
      </p>
    </div>
  );
}

function EmptyFilter({ status, onClear }: { status: ReadingStatus; onClear: () => void }) {
  const label = status === 'to-read' ? 'To Read' : status === 'reading' ? 'Reading' : 'Finished';
  return (
    <div className="py-16 text-center space-y-3">
      <p className="text-4xl">📂</p>
      <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
        No books in "{label}"
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Move books into this section or{' '}
        <button onClick={onClear} className="text-indigo-500 hover:underline">view all</button>.
      </p>
    </div>
  );
}