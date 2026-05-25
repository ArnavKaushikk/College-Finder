'use client';

import { useState } from 'react';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CollegeCard from '@/components/colleges/CollegeCard';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { CollegeCardSkeleton } from '@/components/ui/Skeleton';

const EXAMS = [
  { value: 'JEE', label: 'JEE Main / Advanced' },
  { value: 'NEET', label: 'NEET UG' },
  { value: 'CUET', label: 'CUET' },
];

export default function PredictorForm() {
  const [exam, setExam] = useState('JEE');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, rank: Number(rank) }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setResult(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rank Predictor</h1>
        <p className="mt-1 text-slate-600">
          Rule-based recommendations using exam cutoffs stored in the database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <Select label="Exam" value={exam} onChange={(e) => setExam(e.target.value)}>
          {EXAMS.map((ex) => (
            <option key={ex.value} value={ex.value}>
              {ex.label}
            </option>
          ))}
        </Select>
        <Input
          label="Your rank"
          type="number"
          min="1"
          required
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          placeholder="e.g. 5000"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Get recommendations'}
        </Button>
      </form>

      {error && <ErrorMessage message={error} />}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4">
          {result.message && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              {result.message}
            </p>
          )}
          {result.colleges?.length === 0 ? (
            <EmptyState title="No matches" message="Try a different exam or rank range." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.colleges.map((c) => (
                <CollegeCard key={c.id} college={c} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
