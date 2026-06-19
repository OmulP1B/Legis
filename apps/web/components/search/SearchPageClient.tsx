'use client';
import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import { SearchFilters } from './SearchFilters';
import { Pagination } from './Pagination';
import { apiClient } from '@/lib/api';
import styles from './SearchPageClient.module.css';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const params = {
    q: searchParams.get('q') ?? '',
    tip: searchParams.get('tip') ?? '',
    emitent: searchParams.get('emitent') ?? '',
    status: searchParams.get('status') ?? '',
    an: searchParams.get('an') ?? '',
    page: Number(searchParams.get('page') ?? 1),
    limit: 15,
    sort: searchParams.get('sort') ?? 'date_desc',
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', params],
    queryFn: () => apiClient.get('/documents', { params }).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const updateParam = useCallback((key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    if (key !== 'page') sp.delete('page');
    router.push(`${pathname}?${sp.toString()}`);
  }, [searchParams, router, pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', query);
  };

  const clearAll = () => {
    setQuery('');
    router.push(pathname);
  };

  const hasActiveFilters = !!(params.tip || params.emitent || params.status || params.an || params.q);
  const activeFilterCount = [params.tip, params.emitent, params.status, params.an].filter(Boolean).length;
  const total = data?.meta?.total ?? 0;

  return (
    <div className={styles.page}>
      {/* ─── Search bar ─── */}
      <div className={styles.searchBar}>
        <div className={styles.searchBarInner}>
          <form onSubmit={handleSearch}>
            <div className={styles.searchRow}>
              <div className={styles.inputWrap}>
                <Search className={styles.inputIcon} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Căutați acte normative, legi, hotărâri..."
                  className={styles.searchInput}
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); updateParam('q', ''); }} className={styles.clearBtn}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className={styles.searchSubmitBtn}>Caută</button>
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`${styles.filtersBtn} ${filtersOpen ? styles.filtersBtnActive : ''}`}
              >
                <SlidersHorizontal size={16} />
                <span className={styles.filtersBtnLabel}>Filtre</span>
                {activeFilterCount > 0 && (
                  <span className={styles.filtersBadge}>{activeFilterCount}</span>
                )}
                {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className={styles.content}>
        {/* Filters panel */}
        {filtersOpen && (
          <div className={styles.filtersPanel}>
            <SearchFilters params={params} onUpdate={updateParam} onClear={clearAll} />
          </div>
        )}

        {/* Results meta */}
        <div className={styles.metaBar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isLoading ? (
              <div className={styles.skeletonItem} style={{ height: 16, width: 160, borderRadius: 4 }} />
            ) : (
              <p className={styles.metaText}>
                <span className={styles.metaCount}>{total.toLocaleString('ro-MD')}</span>
                {' '}rezultate
                {params.q && <> pentru <span className={styles.metaQuery}>"{params.q}"</span></>}
              </p>
            )}
            {isFetching && !isLoading && <span className={styles.spinner} />}
          </div>

          <select
            value={params.sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date_desc">Data (recent)</option>
            <option value="date_asc">Data (vechi)</option>
            <option value="title_asc">Titlu A-Z</option>
            <option value="title_desc">Titlu Z-A</option>
          </select>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className={styles.chips}>
            {params.q && (
              <span className={styles.chip}>
                Căutare: "{params.q}"
                <button className={styles.chipRemove} onClick={() => { setQuery(''); updateParam('q', ''); }}><X size={12} /></button>
              </span>
            )}
            {params.tip && (
              <span className={styles.chip}>
                Tip: {params.tip}
                <button className={styles.chipRemove} onClick={() => updateParam('tip', '')}><X size={12} /></button>
              </span>
            )}
            {params.emitent && (
              <span className={styles.chip}>
                Emitent: {params.emitent}
                <button className={styles.chipRemove} onClick={() => updateParam('emitent', '')}><X size={12} /></button>
              </span>
            )}
            {params.status && (
              <span className={styles.chip}>
                Status: {params.status}
                <button className={styles.chipRemove} onClick={() => updateParam('status', '')}><X size={12} /></button>
              </span>
            )}
            {params.an && (
              <span className={styles.chip}>
                An: {params.an}
                <button className={styles.chipRemove} onClick={() => updateParam('an', '')}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearAll} className={styles.resetAllBtn}>
              <X size={12} /> Resetează tot
            </button>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className={styles.resultsList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonItem} />
            ))}
          </div>
        ) : data?.data?.length ? (
          <>
            <div className={styles.resultsList}>
              {data.data.map((doc: any) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
            <div className={styles.paginationWrap}>
              <Pagination
                currentPage={params.page}
                totalPages={Math.ceil(total / params.limit)}
                onPageChange={(p) => updateParam('page', String(p))}
              />
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Search size={32} />
            </div>
            <h3 className={styles.emptyTitle}>Nu au fost găsite rezultate</h3>
            <p className={styles.emptyText}>
              Încercați alte cuvinte cheie sau resetați filtrele pentru a vedea toate documentele.
            </p>
            <button onClick={clearAll} className={styles.emptyBtn}>
              Resetează filtrele
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
