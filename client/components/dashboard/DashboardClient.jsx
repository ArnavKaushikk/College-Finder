'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { CollegeCardSkeleton } from '@/components/ui/Skeleton';
import { formatFees, formatRating } from '@/lib/utils';

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function DashboardClient() {
  const [colleges, setColleges] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [cRes, compRes] = await Promise.allSettled([
        fetchWithTimeout('/api/user/saved-colleges', { credentials: 'include' }),
        fetchWithTimeout('/api/user/saved-comparisons', { credentials: 'include' }),
      ]);

      let nextColleges = [];
      let nextComparisons = [];
      const errors = [];

      if (cRes.status === 'fulfilled') {
        const cJson = await cRes.value.json();
        if (cRes.value.ok && cJson.success) {
          nextColleges = cJson.data.colleges || [];
        } else {
          errors.push(cJson.error || 'Failed to load saved colleges');
        }
      } else {
        errors.push('Failed to load saved colleges');
      }

      if (compRes.status === 'fulfilled') {
        const compJson = await compRes.value.json();
        if (compRes.value.ok && compJson.success) {
          nextComparisons = compJson.data.comparisons || [];
        } else {
          errors.push(compJson.error || 'Failed to load saved comparisons');
        }
      } else {
        errors.push('Failed to load saved comparisons');
      }

      setColleges(nextColleges);
      setComparisons(nextComparisons);
      if (errors.length) setError(errors.join(' | '));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function removeCollege(id) {
    try {
      const res = await fetch(`/api/user/saved-colleges?collegeId=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to remove college');
      }
      setColleges((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to remove college');
    }
  }

  async function removeComparison(id) {
    try {
      const res = await fetch(`/api/user/saved-comparisons?comparisonId=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to remove comparison');
      }
      setComparisons((prev) => prev.filter((comp) => comp.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to remove comparison');
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CollegeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Dashboard</h1>
        <p className="mt-1 text-slate-600">Saved colleges and comparisons.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Saved colleges</h2>
        {colleges.length === 0 ? (
          <EmptyState
            title="No saved colleges"
            message="Save colleges from detail pages to see them here."
            action={
              <Link href="/">
                <Button>Browse colleges</Button>
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {colleges.map((c) => (
              <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <Link href={`/colleges/${c.id}`} className="font-semibold text-indigo-700 hover:underline">
                  {c.name}
                </Link>
                <p className="text-sm text-slate-600 mt-1">{c.location}</p>
                <p className="text-sm mt-2">
                  {formatFees(c.fees)} · ? {formatRating(c.rating)} · {c.placementPercent}% placed
                </p>
                <Button variant="ghost" className="mt-3" onClick={() => removeCollege(c.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Saved comparisons</h2>
        {comparisons.length === 0 ? (
          <EmptyState
            title="No saved comparisons"
            message="Compare 2-3 colleges and save from the compare page."
            action={
              <Link href="/compare">
                <Button>Go to compare</Button>
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {comparisons.map((comp) => (
              <li key={comp.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-900">{comp.label}</p>
                <p className="text-sm text-slate-600 mt-1">{comp.colleges.map((c) => c.name).join(' vs ')}</p>
                <Link
                  href={`/compare?ids=${comp.collegeIds.join(',')}`}
                  className="inline-block mt-3 text-sm text-indigo-600 hover:underline"
                >
                  Open comparison {'->'}
                </Link>
                <div>
                  <Button variant="ghost" className="mt-3" onClick={() => removeComparison(comp.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

