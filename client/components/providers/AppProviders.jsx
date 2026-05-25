'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CompareProvider } from '@/context/CompareContext';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CompareProvider>{children}</CompareProvider>
    </AuthProvider>
  );
}
