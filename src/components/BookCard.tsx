import type { Book, ReadingStatus } from '../types';

const STATUS_LABELS: Record<ReadingStatus, string> = {
  'to-read': 'To Read',
  reading: 'Reading',
  finished: 'Finished',
};

const STATUS_COLORS: Record<ReadingStatus, string> = {
  'to-read': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  reading: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  finished: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const PIPELINE: ReadingStatus[] = ['to-read', 'reading', 'finished'];

interface Props {
  book: Book;
  onStatusChange: (id: string, status: ReadingStatus) => void;
  onRatingChange: (id: string, rating: number) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onStatusChange, onRatingChange, onDelete }: Props) {
  const currentIndex = PIPELINE.indexOf(book.status);

  return (
    <article className="flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        {book.coverId ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="text-5xl">📚</span>
            <span className="text-xs">No cover</span>
          </div>
        )}
        <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[book.status]}`}>
          {STATUS_LABELS[book.status]}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {book.author}
            {book.firstPublishYear ? ` · ${book.firstPublishYear}` : ''}
          </p>
        </div>

        {book.status === 'finished' && (
          <div className="flex items-center gap-1" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRatingChange(book.id, star)}
                className={`text-xl transition-transform hover:scale-110 ${
                  book.rating !== null && star <= book.rating
                    ? 'text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            {book.rating !== null && (
              <button
                onClick={() => onRatingChange(book.id, 0)}
                className="ml-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear rating"
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStatusChange(book.id, PIPELINE[currentIndex - 1])}
            disabled={currentIndex === 0}
            className="flex-1 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Back
          </button>
          <button
            onClick={() => onStatusChange(book.id, PIPELINE[currentIndex + 1])}
            disabled={currentIndex === PIPELINE.length - 1}
            className="flex-1 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            {currentIndex === 0 ? 'Start Reading →' : currentIndex === 1 ? 'Mark Finished →' : 'Finished ✓'}
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm(`Remove "${book.title}" from your library?`)) onDelete(book.id);
          }}
          className="w-full py-1.5 text-xs rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"
        >
          Remove
        </button>
      </div>
    </article>
  );
}