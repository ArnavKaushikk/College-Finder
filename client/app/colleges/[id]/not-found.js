import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold text-slate-900">College not found</h1>
      <p className="mt-2 text-slate-600">This college may have been removed or the link is invalid.</p>
      <Link href="/" className="inline-block mt-6">
        <Button>Back to listing</Button>
      </Link>
    </div>
  );
}
