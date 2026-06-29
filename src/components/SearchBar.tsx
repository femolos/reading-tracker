import { useState, useEffect, useRef } from 'react';
import type { SearchResult, OpenLibraryResponse } from '../types';

interface Props {
  onAdd: (result: SearchResult) => void;
  addedIds: Set<string>;
}

export default function SearchBar({ onAdd, addedIds }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=10`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: OpenLibraryResponse = await res.json();
        setResults(data.docs ?? []);
        setOpen(true);
      } catch {
        setError('Search failed — check your connection and try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </span>
        <input
          type="text"
          placeholder="Search for a book by title, author, or ISBN…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 px-1">{error}</p>
      )}

      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-96 overflow-y-auto">
          {results.map((r) => {
            const alreadyAdded = addedIds.has(r.key);
            return (
              <li
                key={r.key}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
              >
                {r.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${r.cover_i}-S.jpg`}
                    alt={r.title}
                    className="w-8 h-12 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-12 bg-slate-200 dark:bg-slate-600 rounded flex-shrink-0 flex items-center justify-center text-slate-400 text-xs">
                    📖
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {r.author_name?.[0] ?? 'Unknown author'}
                    {r.first_publish_year ? ` · ${r.first_publish_year}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => { onAdd(r); setOpen(false); setQuery(''); }}
                  disabled={alreadyAdded}
                  className={`flex-shrink-0 px-3 py-1 text-xs rounded-lg font-medium transition ${
                    alreadyAdded
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {alreadyAdded ? 'Added' : '+ Add'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {open && !loading && results.length === 0 && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
          No books found for "{query}"
        </div>
      )}
    </div>
  );
}