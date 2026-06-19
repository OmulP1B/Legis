'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Download, Heart, Share2, Printer, Calendar,
  Building2, FileText, Hash, BookOpen, AlertTriangle,
  CheckCircle2, Clock, ChevronRight, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface DocumentVersion {
  id: number;
  version: number;
  dateIssued: string;
  title: string;
}

interface DocumentDetail {
  id: number;
  titleRo: string;
  titleRu?: string;
  type: string;
  number: string;
  emitent: string;
  dateIssued: string;
  datePublished: string;
  moNumber: string;
  status: string;
  bodyRo: string;
  bodyRu?: string;
  versions: DocumentVersion[];
  isFavorite?: boolean;
  repeatedBy?: { id: number; title: string; number: string } | null;
}

export function DocumentDetailClient({ doc }: { doc: DocumentDetail }) {
  const locale = useLocale();
  const qc = useQueryClient();
  const [activeVersion, setActiveVersion] = useState(doc.id);
  const [lang, setLang] = useState<'ro' | 'ru'>(locale === 'ru' ? 'ru' : 'ro');
  const [isFav, setIsFav] = useState(doc.isFavorite ?? false);

  const statusLabel: Record<string, string> = { in_vigoare: 'În vigoare', abrogat: 'Abrogat', suspendat: 'Suspendat' };
  const statusIcon = { in_vigoare: CheckCircle2, abrogat: AlertTriangle, suspendat: Clock };
  const StatusIcon = statusIcon[doc.status as keyof typeof statusIcon] ?? FileText;

  const favMutation = useMutation({
    mutationFn: () => isFav
      ? apiClient.delete(`/favorites/${doc.id}`)
      : apiClient.post('/favorites', { documentId: doc.id }),
    onMutate: () => setIsFav(!isFav),
    onError: () => { setIsFav(isFav); toast.error('Eroare la actualizarea favoritelor'); },
    onSuccess: () => toast.success(isFav ? 'Eliminat din favorite' : 'Adăugat la favorite'),
  });

  const displayTitle = lang === 'ru' && doc.titleRu ? doc.titleRu : doc.titleRo;
  const displayBody = lang === 'ru' && doc.bodyRu ? doc.bodyRu : doc.bodyRo;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">Acasă</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/${locale}/cautare`} className="hover:text-foreground transition-colors">Căutare</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-xs">{doc.type} nr. {doc.number}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="card">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="badge-info">{doc.type}</span>
                <span className={cn(getStatusColor(doc.status), 'flex items-center gap-1')}>
                  <StatusIcon className="h-3 w-3" />
                  {statusLabel[doc.status] ?? doc.status}
                </span>
                <span className="font-mono text-xs text-muted-foreground ml-auto">
                  nr. {doc.number}
                </span>
              </div>

              {/* Abrogat warning */}
              {doc.status === 'abrogat' && doc.repeatedBy && (
                <div className="mb-4 flex items-start gap-3 rounded-lg border border-danger/20 bg-danger-light p-4">
                  <AlertTriangle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-danger mb-1">Acest act a fost abrogat</p>
                    <p className="text-muted-foreground">
                      Abrogat prin{' '}
                      <Link href={`/${locale}/documente/${doc.repeatedBy.id}`} className="text-primary-600 hover:underline font-medium">
                        {doc.repeatedBy.title} nr. {doc.repeatedBy.number}
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Language switcher */}
              {doc.bodyRu && (
                <div className="flex gap-1 mb-5 rounded-lg border border-border p-1 w-fit">
                  {(['ro', 'ru'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn('px-4 py-1.5 rounded-md text-xs font-semibold uppercase transition-all', lang === l ? 'bg-primary-900 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                    >
                      {l === 'ro' ? 'Română' : 'Русский'}
                    </button>
                  ))}
                </div>
              )}

              <h1 className="text-xl font-bold text-foreground leading-snug text-balance mb-6">
                {displayTitle}
              </h1>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <a
                  href={`/api/documents/${doc.id}/pdf`}
                  download
                  className="btn-primary text-sm gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descarcă PDF
                </a>
                <a
                  href={`/api/documents/${doc.id}/pdf?consolidated=true`}
                  download
                  className="btn-outline text-sm gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF consolidat
                </a>
                <button onClick={() => favMutation.mutate()} className={cn('btn-outline text-sm gap-2', isFav && 'text-danger border-danger/30 bg-danger-light hover:bg-red-100')}>
                  <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
                  {isFav ? 'Eliminat din favorite' : 'Favorite'}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copiat'); }} className="btn-ghost text-sm gap-2">
                  <Share2 className="h-4 w-4" /> Distribuie
                </button>
                <button onClick={() => window.print()} className="btn-ghost text-sm gap-2">
                  <Printer className="h-4 w-4" /> Tipărește
                </button>
              </div>
            </div>

            {/* Document body */}
            <div className="card">
              <h2 className="text-base font-semibold mb-4 pb-3 border-b border-border">Conținut act normativ</h2>
              <div
                className="prose prose-sm max-w-none text-foreground leading-relaxed
                  [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-semibold
                  [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3
                  [&_table]:w-full [&_table]:border-collapse
                  [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2
                  [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted"
                dangerouslySetInnerHTML={{ __html: displayBody }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata card */}
            <div className="card">
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Date act normativ</h2>
              <dl className="space-y-3">
                {[
                  { icon: FileText, label: 'Tip', value: doc.type },
                  { icon: Hash, label: 'Număr', value: doc.number },
                  { icon: Building2, label: 'Emitent', value: doc.emitent },
                  { icon: Calendar, label: 'Data emiterii', value: formatDate(doc.dateIssued) },
                  { icon: Calendar, label: 'Data publicării', value: formatDate(doc.datePublished) },
                  { icon: BookOpen, label: 'Nr. Monitor Oficial', value: doc.moNumber },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">{label}</dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5 break-words">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Versions */}
            {doc.versions?.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">
                  Istoricul versiunilor
                </h2>
                <div className="space-y-1.5">
                  {doc.versions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVersion(v.id)}
                      className={cn(
                        'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                        v.id === activeVersion
                          ? 'bg-primary-50 border border-primary-200 text-primary-800'
                          : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      <span>Versiunea {v.version}</span>
                      <span className="text-xs">{formatDate(v.dateIssued)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
