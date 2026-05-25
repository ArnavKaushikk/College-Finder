import { Suspense } from 'react';
import ComparePageClient from '@/components/compare/ComparePageClient';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ComparePage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <ComparePageClient />
    </Suspense>
  );
}
