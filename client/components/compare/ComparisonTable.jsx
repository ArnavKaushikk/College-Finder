import { formatFees, formatRating } from '@/lib/utils';

const rows = [
  { key: 'fees', label: 'Fees', render: (c) => formatFees(c.fees) },
  { key: 'placementPercent', label: 'Placement %', render: (c) => `${c.placementPercent}%` },
  { key: 'rating', label: 'Rating', render: (c) => `★ ${formatRating(c.rating)}` },
  { key: 'location', label: 'Location', render: (c) => c.location },
];

export default function ComparisonTable({ colleges }) {
  if (!colleges?.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-left font-semibold text-slate-700 w-36">Metric</th>
            {colleges.map((c) => (
              <th key={c.id} className="px-4 py-3 text-left font-semibold text-slate-900">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium text-slate-600 bg-slate-50/50">{row.label}</td>
              {colleges.map((c) => (
                <td key={c.id} className="px-4 py-3 text-slate-800">
                  {row.render(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
