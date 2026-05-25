import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchFromApi } from '@/lib/fetchApi';
import { formatFees, formatRating } from '@/lib/utils';
import CollegeDetailActions from '@/components/colleges/CollegeDetailActions';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await fetchFromApi(`/api/colleges/${id}`);
  if (!data?.college) return { title: 'College not found' };
  return { title: `${data.college.name} | CollegeHub` };
}

export default async function CollegeDetailPage({ params }) {
  const { id } = await params;
  const { data, error } = await fetchFromApi(`/api/colleges/${id}`);

  if (error || !data?.college) notFound();
  const college = data.college;

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'courses', title: 'Courses' },
    { id: 'placements', title: 'Placements' },
    { id: 'reviews', title: 'Reviews' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to listing
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{college.name}</h1>
        <p className="mt-1 text-slate-600">{college.location}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <span className="font-semibold text-indigo-700">★ {formatRating(college.rating)}</span>
          <span>{formatFees(college.fees)}</span>
          <span>{college.placementPercent}% placement</span>
          <span>{college.type}</span>
          {college.established && <span>Est. {college.established}</span>}
        </div>
        <div className="mt-4">
          <CollegeDetailActions collegeId={college.id} />
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <section id="overview" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-24">
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">{college.overview}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-slate-500">Annual fees</dt>
            <dd className="font-medium">{formatFees(college.fees)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Courses offered</dt>
            <dd className="font-medium">{college.courses.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Location</dt>
            <dd className="font-medium">{college.location}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Placement rate</dt>
            <dd className="font-medium">{college.placementPercent}%</dd>
          </div>
        </dl>
      </section>

      <section id="courses" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-24">
        <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {college.courses.map((course) => (
            <li key={course} className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
              {course}
            </li>
          ))}
        </ul>
      </section>

      <section id="placements" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-24">
        <h2 className="text-xl font-semibold text-slate-900">Placements</h2>
        <p className="mt-3 text-slate-700">{college.placements?.summary}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-slate-500">Average package</dt>
            <dd className="font-medium">{college.placements?.averagePackage}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Highest package</dt>
            <dd className="font-medium">{college.placements?.highestPackage}</dd>
          </div>
        </dl>
        {college.placements?.topRecruiters?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">Top recruiters</p>
            <div className="flex flex-wrap gap-2">
              {college.placements.topRecruiters.map((r) => (
                <span key={r} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section id="reviews" className="rounded-xl border border-slate-200 bg-white p-6 scroll-mt-24">
        <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
        <p className="mt-1 text-xs text-slate-500">Sample reviews for demonstration</p>
        <ul className="mt-4 space-y-4">
          {college.reviews?.map((review, i) => (
            <li key={i} className="border-b border-slate-100 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{review.author}</span>
                <span className="text-sm text-amber-600">★ {review.rating}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
