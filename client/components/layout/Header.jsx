'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';
import Button from '@/components/ui/Button';

const links = [
  { href: '/', label: 'Colleges' },
  { href: '/compare', label: 'Compare' },
  { href: '/predictor', label: 'Predictor' },
  { href: '/qa', label: 'Q&A' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { count, ids } = useCompare();

  const compareHref = ids.length > 0 ? `/compare?ids=${ids.join(',')}` : '/compare';

  async function handleLogout() {
    await logout();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-indigo-700">
          CollegeHub
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const href = link.href === '/compare' ? compareHref : link.href;
            const active = pathname === link.href || (link.href === '/compare' && pathname.startsWith('/compare'));
            return (
              <Link
                key={link.href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
                {link.href === '/compare' && count > 0 && (
                  <span className="ml-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs text-white">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-slate-600">Hi, {user.name}</span>
                  <Button variant="secondary" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Sign up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2">
        {links.map((link) => {
          const href = link.href === '/compare' ? compareHref : link.href;
          return (
            <Link
              key={link.href}
              href={href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100"
            >
              {link.label}
              {link.href === '/compare' && count > 0 ? ` (${count})` : ''}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
