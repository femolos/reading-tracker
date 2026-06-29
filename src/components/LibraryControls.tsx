import type { ReadingStatus, SortField, SortDir } from '../types';

interface Props {
  filterStatus: ReadingStatus | 'all';
  sortField: SortField;
  sortDir: SortDir;
  onFilter: (status: ReadingStatus | 'all') => void;
  onSort: (field: SortField, dir: SortDir) => void;
}

const FILTERS: { label: string; value: ReadingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Read', value: 'to-read' },
  { label: 'Reading', value: 'reading' },
  { label: 'Finished', value: 'finished' },
];

const SORT_FIELDS: { label: string; value: SortField }[] = [
  { label: 'Date Added', value: 'addedAt' },
  { label: 'Title', value: 'title' },
  { label: 'Author', value: 'author' },
];

export default function LibraryControls({ filterStatus, sortField, sortDir, onFilter, onSort }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${
              filterStatus === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <select
          value={sortField}
          onChange={(e) => onSort(e.target.value as SortField, sortDir)}
          className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {SORT_FIELDS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          onClick={() => onSort(sortField, sortDir === 'asc' ? 'desc' : 'asc')}
          className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          aria-label={`Sort ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>
    </div>
  );
}