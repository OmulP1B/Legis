'use client';
import { FileText, Clock, CheckCircle2, TrendingUp, Users, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const stats = [
  { label: 'Total documente', value: '12,450', change: '+124 luna aceasta', icon: FileText, color: 'bg-primary-50 text-primary-700', trend: 'up' },
  { label: 'În așteptare', value: '23', change: '5 noi astăzi', icon: Clock, color: 'bg-warning-light text-warning', trend: 'neutral' },
  { label: 'Publicate', value: '12,210', change: '+98 luna aceasta', icon: CheckCircle2, color: 'bg-success-light text-success', trend: 'up' },
  { label: 'Utilizatori activi', value: '1,842', change: '+12% față de luna trecută', icon: Users, color: 'bg-info-light text-info', trend: 'up' },
];

const recentActivity = [
  { action: 'Document aprobat', doc: 'Legea nr. 142/2024', user: 'I. Popescu', time: 'acum 5 min', status: 'success' },
  { action: 'Document adăugat', doc: 'HG nr. 560/2024', user: 'M. Ionescu', time: 'acum 23 min', status: 'info' },
  { action: 'Document dezaprobat', doc: 'Ordin nr. 45/2024', user: 'A. Rusu', time: 'acum 1 oră', status: 'warning' },
  { action: 'Document actualizat', doc: 'Regulament nr. 12/2024', user: 'I. Popescu', time: 'acum 2 ore', status: 'info' },
  { action: 'Utilizator creat', doc: 'Cont nou: v.marin@gov.md', user: 'Admin', time: 'acum 3 ore', status: 'success' },
];

export function AdminDashboard() {
  const locale = useLocale();

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panou principal</h1>
        <p className="text-muted-foreground text-sm mt-1">Bine ai venit! Iată o privire de ansamblu asupra portalului.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color, trend }) => (
          <div key={label} className="card hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              {trend === 'up' && (
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp className="h-3 w-3" /> +
                </span>
              )}
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground mt-1">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Activitate recentă
            </h2>
            <Link href={`/${locale}/admin/loguri`} className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium">
              Vezi tot <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${{success:'bg-success',info:'bg-info',warning:'bg-warning'}[item.status]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.doc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                  <p className="text-xs text-muted-foreground/60">{item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h2 className="text-base font-semibold mb-5">Acțiuni rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: `/${locale}/admin/documente/nou`, label: 'Adaugă document', icon: FileText, variant: 'primary' },
              { href: `/${locale}/admin/documente?status=in_asteptare`, label: 'Documente în așteptare', icon: Clock, variant: 'warning' },
              { href: `/${locale}/admin/utilizatori/nou`, label: 'Adaugă utilizator', icon: Users, variant: 'default' },
              { href: `/${locale}/admin/rapoarte`, label: 'Generează raport', icon: TrendingUp, variant: 'default' },
            ].map(({ href, label, icon: Icon, variant }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-start gap-2.5 rounded-lg border p-4 transition-all hover:shadow-card ${
                  variant === 'primary' ? 'border-primary-200 bg-primary-50 hover:bg-primary-100' :
                  variant === 'warning' ? 'border-amber-200 bg-amber-50 hover:bg-amber-100' :
                  'border-border hover:bg-muted'
                }`}
              >
                <Icon className={`h-5 w-5 ${variant === 'primary' ? 'text-primary-700' : variant === 'warning' ? 'text-warning' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
