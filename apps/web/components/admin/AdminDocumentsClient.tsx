'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { Plus, Search, Filter, CheckCircle2, XCircle, Trash2, Edit, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

type DocStatus = 'all' | 'incomplet' | 'in_asteptare' | 'aprobat' | 'dezaprobat' | 'sters';

const STATUS_TABS: { value: DocStatus; label: string }[] = [
  { value: 'all', label: 'Toate' },
  { value: 'in_asteptare', label: 'În așteptare' },
  { value: 'aprobat', label: 'Aprobate' },
  { value: 'dezaprobat', label: 'Dezaprobate' },
  { value: 'incomplet', label: 'Incomplete' },
  { value: 'sters', label: 'Șterse' },
];

export function AdminDocumentsClient() {
  const locale = useLocale();
  const qc = useQueryClient();
  const [status, setStatus] = useState<DocStatus>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-documents', status, search, page],
    queryFn: () => apiClient.get('/admin/documents', {
      params: { status: status === 'all' ? '' : status, q: search, page, limit: 20 }
    }).then(r => r.data),
  });

  const approve = useMutation({
    mutationFn: (id: number) => apiClient.post(`/admin/documents/${id}/approve`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-documents'] }); toast.success('Document aprobat'); },
  });
  const unapprove = useMutation({
    mutationFn: (id: number) => apiClient.post(`/admin/documents/${id}/unapprove`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-documents'] }); toast.success('Document dezaprobat'); },
  });
  const del = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/admin/documents/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-documents'] }); toast.success('Document șters'); },
  });

  const docs = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documente</h1>
          <p className="text-sm text-muted-foreground mt-1">{total.toLocaleString('ro-MD')} documente în total</p>
        </div>
        <Link href={`/${locale}/admin/documente/nou`} className="btn-primary gap-2">
          <Plus className="h-4 w-4" /> Adaugă document
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Caută după titlu, număr..."
              className="input pl-9 text-sm"
            />
          </div>
          <button className="btn-outline gap-2 text-sm">
            <Filter className="h-4 w-4" /> Filtre avansate
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-lg w-fit">
          {STATUS_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setStatus(value); setPage(1); }}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                status === value ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Titlu</th>
                <th className="w-28">Tip</th>
                <th className="w-28">Număr</th>
                <th className="w-32">Data</th>
                <th className="w-28">Status</th>
                <th className="w-32 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j}><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : docs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    Nu există documente cu criteriile selectate.
                  </td>
                </tr>
              ) : docs.map((doc: any, i: number) => (
                <tr key={doc.id}>
                  <td className="text-muted-foreground text-xs font-mono">{(page-1)*20+i+1}</td>
                  <td>
                    <p className="text-sm font-medium line-clamp-1 max-w-xs">{doc.titleRo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.emitent}</p>
                  </td>
                  <td><span className="badge-info text-xs">{doc.type}</span></td>
                  <td><span className="font-mono text-xs">{doc.number}</span></td>
                  <td><span className="text-xs text-muted-foreground">{formatDate(doc.dateIssued)}</span></td>
                  <td>
                    <span className={cn(getStatusColor(doc.status), 'text-xs')}>
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/${locale}/admin/documente/${doc.id}`} className="btn-ghost h-7 w-7 p-0 text-muted-foreground hover:text-primary-600">
                        <Edit className="h-3.5 w-3.5" />
                      </Link>
                      {doc.status === 'in_asteptare' && (
                        <button onClick={() => approve.mutate(doc.id)} className="btn-ghost h-7 w-7 p-0 text-muted-foreground hover:text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {doc.status === 'aprobat' && (
                        <button onClick={() => unapprove.mutate(doc.id)} className="btn-ghost h-7 w-7 p-0 text-muted-foreground hover:text-warning">
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {doc.status === 'sters' ? (
                        <button onClick={() => approve.mutate(doc.id)} className="btn-ghost h-7 w-7 p-0 text-muted-foreground hover:text-info">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => { if(confirm('Ștergeți documentul?')) del.mutate(doc.id); }} className="btn-ghost h-7 w-7 p-0 text-muted-foreground hover:text-danger">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
