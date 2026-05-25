'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'compare_college_ids';
const MAX_COMPARE = 3;

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setIds(parsed.slice(0, MAX_COMPARE));
      }
    } catch {
      setIds([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const addCollege = useCallback((id) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const removeCollege = useCallback((id) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearAll = useCallback(() => setIds([]), []);

  const isInCompare = useCallback((id) => ids.includes(id), [ids]);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      max: MAX_COMPARE,
      addCollege,
      removeCollege,
      clearAll,
      isInCompare,
      isFull: ids.length >= MAX_COMPARE,
    }),
    [ids, addCollege, removeCollege, clearAll, isInCompare]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
