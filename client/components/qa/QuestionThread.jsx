'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/Skeleton';

export default function QuestionThread({ questionId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/questions/${questionId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setQuestion(json.data.question);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [questionId]);

  async function handleAnswer(e) {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answer }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setQuestion(json.data.question);
      setAnswer('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error && !question) return <ErrorMessage message={error} onRetry={load} />;
  if (!question) return null;

  return (
    <div className="space-y-6">
      <Link href="/qa" className="text-sm text-indigo-600 hover:underline">
        ← Back to questions
      </Link>
      <article className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">{question.title}</h1>
        <p className="mt-2 text-xs text-slate-500">
          {question.authorName} · {new Date(question.createdAt).toLocaleString()}
        </p>
        <p className="mt-4 text-slate-700 whitespace-pre-wrap">{question.body}</p>
      </article>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Answers ({question.answers?.length || 0})
        </h2>
        {question.answers?.length === 0 && (
          <p className="text-sm text-slate-500">No answers yet. Be the first to reply.</p>
        )}
        <ul className="space-y-3">
          {question.answers?.map((a) => (
            <li key={a.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs text-slate-500 mb-2">
                {a.authorName} · {new Date(a.createdAt).toLocaleString()}
              </p>
              <p className="text-slate-700 whitespace-pre-wrap">{a.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={handleAnswer} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Post an answer</h3>
        {!user && <p className="text-sm text-slate-600">You must log in to post an answer.</p>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your answer</label>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[120px] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            minLength={5}
            disabled={!user}
            placeholder="Share your experience or advice..."
          />
        </div>
        <Button type="submit" disabled={submitting || !user}>
          {submitting ? 'Posting...' : 'Post answer'}
        </Button>
      </form>
    </div>
  );
}
