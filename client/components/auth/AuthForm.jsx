'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const router = useRouter();
  const { user, loading: authLoading, setUser, refresh } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setUser(json.data.user);
      await refresh();
      router.replace('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md w-full">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-slate-900">{isLogin ? 'Login' : 'Create account'}</h1>
        {error && <ErrorMessage message={error} />}
        {!isLogin && (
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Please wait...' : isLogin ? 'Login' : 'Sign up'}
        </Button>
        <p className="text-center text-sm text-slate-600">
          {isLogin ? (
            <>
              No account?{' '}
              <Link href="/auth/register" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/auth/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
