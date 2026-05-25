'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/Skeleton';

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions?page=${page}&limit=10`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setQuestions(json.data.questions);
        setPagination(json.data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Q&A Discussion</h1>
          <p className="mt-1 text-slate-600">Ask questions and help others with answers.</p>
        </div>
        <Link href="/qa/new">
          <Button>Ask a question</Button>
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && questions.length === 0 && (
        <EmptyState
          title="No questions yet"
          message="Be the first to start a discussion."
          action={
            <Link href="/qa/new">
              <Button>Ask a question</Button>
            </Link>
          }
        />
      )}

      {!loading && !error && questions.length > 0 && (
        <ul className="space-y-3">
          {questions.map((q) => (
            <li key={q.id}>
              <Link
                href={`/qa/${q.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{q.title}</h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{q.body}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {q.authorName} · {q.answerCount} answer{q.answerCount !== 1 ? 's' : ''} ·{' '}
                  {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-slate-600 self-center">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
