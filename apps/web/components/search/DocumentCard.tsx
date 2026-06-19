import Link from 'next/link';
import { useLocale } from 'next-intl';
import { FileText, Calendar, Building2, Download, ArrowRight } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';
import styles from './DocumentCard.module.css';

export interface DocumentData {
  id: number;
  title: string;
  type: string;
  number: string;
  emitent: string;
  dateIssued: string;
  status: string;
  moNumber?: string;
}

export function DocumentCard({ doc }: { doc: DocumentData }) {
  const locale = useLocale();
  const statusClass = getStatusColor(doc.status);
  const statusLabel = { in_vigoare: 'În vigoare', abrogat: 'Abrogat', suspendat: 'Suspendat' }[doc.status] ?? doc.status;

  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>
        <FileText size={16} />
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className="badge-info">{doc.type}</span>
          <span className={statusClass}>{statusLabel}</span>
          <span className={styles.number}>{doc.number}</span>
        </div>

        <Link href={`/${locale}/documente/${doc.id}`} className={styles.title}>
          {doc.title}
        </Link>

        <div className={styles.footer}>
          <span className={styles.footerItem}>
            <Calendar size={12} />
            {formatDate(doc.dateIssued)}
          </span>
          <span className={styles.footerItem}>
            <Building2 size={12} />
            {doc.emitent}
          </span>
          {doc.moNumber && <span>MO nr. {doc.moNumber}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <Link href={`/${locale}/documente/${doc.id}`} className={`${styles.actionBtn} ${styles.actionOpen}`}>
          Deschide <ArrowRight size={12} />
        </Link>
        <a
          href={`/api/documents/${doc.id}/pdf`}
          className={`${styles.actionBtn} ${styles.actionPdf}`}
          download
        >
          <Download size={12} /> PDF
        </a>
      </div>
    </article>
  );
}
