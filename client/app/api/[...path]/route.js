const RAW_BACKEND_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

function normalizeBackendBase(raw) {
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function trimTrailingSlash(pathname) {
  if (!pathname || pathname === '/') return '';
  return pathname.replace(/\/+$/, '');
}

function makeTargetUrl(request, segments) {
  const base = normalizeBackendBase(RAW_BACKEND_BASE);
  if (!base) {
    return {
      error: "Server is missing API_URL/NEXT_PUBLIC_API_URL in environment variables.",
    };
  }

  const requestHost = request.headers.get('host');
  if (requestHost && base.host === requestHost) {
    return {
      error: 'API_URL points to this same frontend host. Set API_URL to your backend service URL.',
    };
  }

  const basePath = trimTrailingSlash(base.pathname);
  const apiPrefix = basePath.endsWith('/api') ? basePath : `${basePath}/api`;
  const suffix = segments.length > 0 ? `/${segments.join('/')}` : '';
  const pathname = `${apiPrefix}${suffix}`.replace(/\/+/g, '/');

  return {
    url: `${base.origin}${pathname}${request.nextUrl.search}`,
  };
}

async function proxyRequest(request, context) {
  const params = await context.params;
  const segments = Array.isArray(params?.path) ? params.path : [];
  const target = makeTargetUrl(request, segments);

  if (target.error) {
    return Response.json(
      {
        success: false,
        error: target.error,
      },
      { status: 500 }
    );
  }

  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.delete('host');
  forwardHeaders.delete('content-length');

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const upstream = await fetch(target.url, {
      method: request.method,
      headers: forwardHeaders,
      body,
      redirect: 'follow',
      cache: 'no-store',
    });

    const responseHeaders = new Headers(upstream.headers);

    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Failed to reach backend API. Verify API_URL points to a live backend.',
      },
      { status: 502 }
    );
  }
}

export async function GET(request, context) {
  return proxyRequest(request, context);
}

export async function POST(request, context) {
  return proxyRequest(request, context);
}

export async function PUT(request, context) {
  return proxyRequest(request, context);
}

export async function PATCH(request, context) {
  return proxyRequest(request, context);
}

export async function DELETE(request, context) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request, context) {
  return proxyRequest(request, context);
}

export async function HEAD(request, context) {
  return proxyRequest(request, context);
}
