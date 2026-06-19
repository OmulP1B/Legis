'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './HeroSearch.module.css';

export function HeroSearch() {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/cautare?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, locale, router]);

  return (
    <section className={styles.section}>
      <div className={styles.bg}>
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
        <div className={styles.bgGrid} />
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Actualizat zilnic cu acte normative oficiale
          </div>

          {/* Heading */}
          <h1 className={styles.heading}>{t('hero_title')}</h1>
          <p className={styles.subtitle}>{t('hero_subtitle')}</p>

          {/* Search form */}
          <form onSubmit={handleSearch}>
            <div className={styles.searchForm}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className={styles.searchInput}
                autoComplete="off"
              />
              <button type="submit" className={styles.searchBtn}>
                {t('search_button')}
                <ArrowRight className={styles.searchBtnIcon} />
              </button>
            </div>
          </form>

          {/* Quick filters */}
          <div className={styles.filters}>
            <span className={styles.filtersLabel}>Căutări frecvente:</span>
            {['Codul Muncii', 'Codul Civil', 'Constituție', 'Cod Fiscal', 'Cod Penal'].map((term) => (
              <Link
                key={term}
                href={`/${locale}/cautare?q=${encodeURIComponent(term)}`}
                className={styles.filterChip}
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Advanced search */}
          <Link href={`/${locale}/cautare?advanced=1`} className={styles.advancedLink}>
            <Search className={styles.advancedIcon} />
            {t('advanced_search')}
          </Link>
        </div>
      </div>
    </section>
  );
}
