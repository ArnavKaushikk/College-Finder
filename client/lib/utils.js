export function formatFees(fees) {
  if (fees >= 100000) {
    return `₹${(fees / 100000).toFixed(fees % 100000 === 0 ? 0 : 1)}L/yr`;
  }
  return `₹${fees.toLocaleString('en-IN')}/yr`;
}

export function formatRating(rating) {
  return Number(rating).toFixed(1);
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
}
