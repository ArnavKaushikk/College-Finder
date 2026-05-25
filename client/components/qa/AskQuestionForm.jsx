'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function AskQuestionForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.push(`/qa/${json.data.question.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold text-slate-900">Ask a question</h1>
      {error && <ErrorMessage message={error} />}
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        minLength={5}
        placeholder="e.g. Which NIT is best for CSE placements?"
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[160px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={10}
          placeholder="Describe your question in detail..."
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Post question'}
      </Button>
    </form>
  );
}
