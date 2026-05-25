'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ComparisonTable from './ComparisonTable';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';

export default function ComparePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { ids: contextIds, clearAll } = useCompare();

  const urlIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const ids = urlIds.length > 0 ? urlIds.slice(0, 3) : contextIds;

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (ids.length < 2) {
      setLoading(false);
      setColleges([]);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/colleges?ids=${ids.join(',')}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setColleges(json.data.colleges);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ids.join(',')]);

  async function saveComparison() {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      const res = await fetch('/api/user/saved-comparisons', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: ids, label: 'My comparison' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSaveMsg('Comparison saved to dashboard');
    } catch (err) {
      setSaveMsg(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare Colleges</h1>
          <p className="mt-1 text-slate-600">Side-by-side comparison of up to 3 colleges.</p>
        </div>
        {ids.length >= 2 && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={clearAll}>
              Clear selection
            </Button>
            <Button onClick={saveComparison}>{user ? 'Save comparison' : 'Login to save'}</Button>
          </div>
        )}
      </div>

      {saveMsg && <p className="text-sm text-green-700">{saveMsg}</p>}

      {ids.length < 2 && (
        <EmptyState
          title="Select at least 2 colleges"
          message="Add colleges from the listing or detail pages using “Add to compare”."
          action={
            <Link href="/">
              <Button>Browse colleges</Button>
            </Link>
          }
        />
      )}

      {ids.length >= 2 && loading && <Skeleton className="h-48 w-full" />}
      {ids.length >= 2 && error && <ErrorMessage message={error} />}
      {ids.length >= 2 && !loading && !error && colleges.length > 0 && (
        <ComparisonTable colleges={colleges} />
      )}
    </div>
  );
}
