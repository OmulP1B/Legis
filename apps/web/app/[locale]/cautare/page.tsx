import { PublicLayout } from '@/components/layout/PublicLayout';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Căutare acte normative',
  description: 'Căutați în baza de date legislativă a Republicii Moldova',
};

export default function SearchPage() {
  return (
    <PublicLayout>
      <SearchPageClient />
    </PublicLayout>
  );
}
