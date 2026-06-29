import type { Book } from '../types';

interface Props {
  books: Book[];
}

export default function StatsBar({ books }: Props) {
  const toRead = books.filter((b) => b.status === 'to-read').length;
  const reading = books.filter((b) => b.status === 'reading').length;
  const finished = books.filter((b) => b.status === 'finished').length;
  const rated = books.filter((b) => b.status === 'finished' && b.rating !== null);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1)
      : null;

  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm">
      <Stat label="To Read" value={toRead} color="text-amber-500" />
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
      <Stat label="Reading" value={reading} color="text-indigo-500" />
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
      <Stat label="Finished" value={finished} color="text-emerald-500" />
      {avgRating !== null && (
        <>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <span className="text-slate-500 dark:text-slate-400">
            Avg rating: <span className="font-semibold text-yellow-500">★ {avgRating}</span>
          </span>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="text-slate-600 dark:text-slate-300">
      <span className={`font-bold ${color}`}>{value}</span> {label}
    </span>
  );
}