import { getTranslations } from 'next-intl/server';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSearch } from '@/components/home/HeroSearch';
import { StatsBar } from '@/components/home/StatsBar';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { RecentDocuments } from '@/components/home/RecentDocuments';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home');
  return {
    title: 'Acasă | Portal Legislativ',
    description: t('hero_subtitle'),
  };
}

export default async function HomePage() {
  return (
    <PublicLayout>
      {/* Hero with search */}
      <HeroSearch />
      {/* Stats */}
      <StatsBar />
      {/* Main content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentDocuments />
          </div>
          <div>
            <CategoryGrid />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
