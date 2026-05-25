export function getApiBase() {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
}

export async function fetchFromApi(path, options = {}) {
  const base = getApiBase();
  const res = await fetch(`${base}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    return { error: json.error || 'Request failed', data: null };
  }
  return { data: json.data, error: null };
}
