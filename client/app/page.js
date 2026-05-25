import { Suspense } from 'react';
import CollegeListing from '@/components/colleges/CollegeListing';
import { CollegeCardSkeleton } from '@/components/ui/Skeleton';

function ListingFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CollegeCardSkeleton key={i} />
      ))}
    </div>
  );
}


export default function HomePage() {
  return (
    <Suspense fallback={<ListingFallback />}>
      <CollegeListing />
    </Suspense>
  );
}
