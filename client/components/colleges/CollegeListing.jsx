'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CollegeCard from './CollegeCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { CollegeCardSkeleton } from '@/components/ui/Skeleton';

export default function CollegeListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [minFees, setMinFees] = useState(searchParams.get('minFees') || '');
  const [maxFees, setMaxFees] = useState(searchParams.get('maxFees') || '');
  const [course, setCourse] = useState(searchParams.get('course') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/colleges/courses')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCourses(json.data.courses || []);
      })
      .catch(() => {});
  }, []);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (minFees) params.set('minFees', minFees);
    if (maxFees) params.set('maxFees', maxFees);
    if (course) params.set('course', course);
    params.set('page', String(page));
    params.set('limit', '12');

    try {
      const res = await fetch(`/api/colleges?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setColleges(json.data.colleges);
      setPagination(json.data.pagination);
    } catch (err) {
      setError(err.message);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, [q, minFees, maxFees, course, page]);

  useEffect(() => {
    const t = setTimeout(() => fetchColleges(), 300);
    return () => clearTimeout(t);
  }, [fetchColleges]);

  function applyFilters(e) {
    e?.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (minFees) params.set('minFees', minFees);
    if (maxFees) params.set('maxFees', maxFees);
    if (course) params.set('course', course);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  }

  function goToPage(p) {
    setPage(p);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`/?${params.toString()}`);
  }

  function clearFilters() {
    setQ('');
    setMinFees('');
    setMaxFees('');
    setCourse('');
    setPage(1);
    router.push('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discover Colleges</h1>
        <p className="mt-1 text-slate-600">Search and filter colleges — results load from the server.</p>
      </div>

      <form onSubmit={applyFilters} className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
        <Input
          label="Search by name"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. IIT, NIT, Medical..."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Min fees (₹/year)"
            name="minFees"
            type="number"
            min="0"
            value={minFees}
            onChange={(e) => setMinFees(e.target.value)}
            placeholder="50000"
          />
          <Input
            label="Max fees (₹/year)"
            name="maxFees"
            type="number"
            min="0"
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
            placeholder="500000"
          />
          <Select label="Course" name="course" value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Apply filters</Button>
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </form>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && <ErrorMessage message={error} onRetry={fetchColleges} />}

      {!loading && !error && colleges.length === 0 && (
        <EmptyState
          title="No colleges found"
          message="Try adjusting your search or filters."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}

      {!loading && !error && colleges.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} colleges)
              </span>
              <Button
                variant="secondary"
                disabled={page >= pagination.totalPages}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
