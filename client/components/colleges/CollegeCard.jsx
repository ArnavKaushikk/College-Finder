'use client';

import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { formatFees, formatRating } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function CollegeCard({ college }) {
  const { addCollege, removeCollege, isInCompare, isFull } = useCompare();
  const inCompare = isInCompare(college.id);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 leading-snug">
            <Link href={`/colleges/${college.id}`} className="hover:text-indigo-700">
              {college.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-slate-600">{college.location}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-indigo-700">★ {formatRating(college.rating)}</p>
          <p className="text-xs text-slate-500">{college.placementPercent}% placed</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-800">{formatFees(college.fees)}</p>
      {college.courses?.length > 0 && (
        <p className="mt-2 text-xs text-slate-500 line-clamp-1">
          {college.courses.slice(0, 3).join(' · ')}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/colleges/${college.id}`}>
          <Button variant="secondary">View details</Button>
        </Link>
        <Button
          variant={inCompare ? 'danger' : 'ghost'}
          onClick={() => (inCompare ? removeCollege(college.id) : addCollege(college.id))}
          disabled={!inCompare && isFull}
        >
          {inCompare ? 'Remove' : isFull ? 'Compare full' : 'Add to compare'}
        </Button>
      </div>
    </article>
  );
}
