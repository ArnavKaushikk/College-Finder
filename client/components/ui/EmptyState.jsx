export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
