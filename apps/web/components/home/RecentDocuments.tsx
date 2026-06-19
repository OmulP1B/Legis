import Link from 'next/link';
import { ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './RecentDocuments.module.css';

async function getRecentDocuments() {
  return [
    { id: 1, title: 'Legea nr. 142/2024 privind modificarea Codului Fiscal', type: 'Lege', number: '142/2024', date: '2024-07-15', status: 'in_vigoare', emitent: 'Parlamentul RM' },
    { id: 2, title: 'Hotărârea Guvernului nr. 558/2024 cu privire la aprobarea Programului Național de Sănătate', type: 'Hotărâre Guvern', number: '558/2024', date: '2024-07-12', status: 'in_vigoare', emitent: 'Guvernul RM' },
    { id: 3, title: 'Decretul Președintelui nr. 1203/2024 privind numirea unui judecător', type: 'Decret', number: '1203/2024', date: '2024-07-10', status: 'in_vigoare', emitent: 'Președinția RM' },
    { id: 4, title: 'Ordinul Ministerului Educației nr. 87/2024 privind aprobarea planurilor de studii', type: 'Ordin', number: '87/2024', date: '2024-07-08', status: 'in_vigoare', emitent: 'Min. Educației' },
    { id: 5, title: 'Regulamentul privind condițiile de licențiere a activităților financiare nebancare', type: 'Regulament', number: 'R-45/2024', date: '2024-07-05', status: 'in_vigoare', emitent: 'BNM' },
    { id: 6, title: 'Hotărârea Parlamentului nr. 112/2024 privind ratificarea acordului de asociere', type: 'Hotărâre Parlament', number: '112/2024', date: '2024-07-02', status: 'in_vigoare', emitent: 'Parlamentul RM' },
  ];
}

export async function RecentDocuments() {
  const docs = await getRecentDocuments();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Acte normative recente</h2>
        <Link href="/ro/cautare?sort=date_desc" className={styles.viewAll}>
          Vezi toate <ArrowRight className={styles.viewAllIcon} />
        </Link>
      </div>

      <div className={styles.list}>
        {docs.map((doc, idx) => (
          <article key={doc.id} className={`${styles.docItem} ${idx % 2 === 0 ? styles.docItemEven : ''}`}>
            <div className={styles.docRow}>
              <div className={styles.docNumBadge}>
                {doc.number.split('/')[0].slice(-2)}
              </div>

              <div className={styles.docBody}>
                <div className={styles.docMeta}>
                  <span className="badge-info">{doc.type}</span>
                  {doc.status === 'in_vigoare' && (
                    <span className={styles.statusActive}>În vigoare</span>
                  )}
                </div>

                <Link href={`/ro/documente/${doc.id}`} className={styles.docTitle}>
                  {doc.title}
                </Link>

                <div className={styles.docFooter}>
                  <span className={styles.docFooterItem}>
                    <Clock className={styles.docFooterIcon} />
                    {formatDate(doc.date)}
                  </span>
                  <span>{doc.emitent}</span>
                  <span className={styles.docNumber}>{doc.number}</span>
                </div>
              </div>

              <Link href={`/ro/documente/${doc.id}`} className={styles.docExtIcon} aria-label="Deschide document">
                <ExternalLink size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
