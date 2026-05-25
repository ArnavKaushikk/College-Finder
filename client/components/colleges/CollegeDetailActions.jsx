'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function CollegeDetailActions({ collegeId }) {
  const { user } = useAuth();
  const { addCollege, removeCollege, isInCompare, isFull, ids } = useCompare();
  const router = useRouter();
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const inCompare = isInCompare(collegeId);

  async function handleSave() {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/user/saved-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSaveMsg('Saved to dashboard');
    } catch (err) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button variant="secondary" onClick={handleSave} disabled={saving}>
        {user ? (saving ? 'Saving...' : 'Save college') : 'Login to save'}
      </Button>
      <Button
        variant={inCompare ? 'danger' : 'ghost'}
        onClick={() => (inCompare ? removeCollege(collegeId) : addCollege(collegeId))}
        disabled={!inCompare && isFull}
      >
        {inCompare ? 'Remove from compare' : 'Add to compare'}
      </Button>
      {ids.length >= 2 && (
        <Link href={`/compare?ids=${ids.join(',')}`}>
          <Button>View comparison ({ids.length})</Button>
        </Link>
      )}
      {saveMsg && <span className="text-sm text-green-700">{saveMsg}</span>}
    </div>
  );
}
