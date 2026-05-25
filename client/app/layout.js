import './globals.css';
import AppProviders from '@/components/providers/AppProviders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'CollegeHub — Discover & Compare Colleges',
  description: 'College discovery, comparison, rank predictor, and student Q&A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <AppProviders>
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
