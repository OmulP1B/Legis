import Link from 'next/link';
import { Scale, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.body}>
        <div className={styles.grid}>
          {/* Brand */}
          <div>
            <div className={styles.brandRow}>
              <div className={styles.brandIcon}>
                <Scale size={20} />
              </div>
              <div>
                <p className={styles.brandTitle}>Portal Legislativ</p>
                <p className={styles.brandSubtitle}>Republica Moldova</p>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Baza de date legislativă oficială a Republicii Moldova. Acces gratuit la actele normative publicate în Monitorul Oficial.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className={styles.colTitle}>Navigare</h3>
            <ul className={styles.linkList}>
              {[
                { href: '/ro', label: 'Acasă' },
                { href: '/ro/cautare', label: 'Căutare documente' },
                { href: '/ro/documente', label: 'Toate documentele' },
                { href: '/ro/despre', label: 'Despre portal' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Document types */}
          <div>
            <h3 className={styles.colTitle}>Tipuri de acte</h3>
            <ul className={styles.linkList}>
              {['Legi', 'Hotărâri de Guvern', 'Decrete Prezidențiale', 'Ordine ministeriale', 'Regulamente', 'Coduri'].map((type) => (
                <li key={type}>
                  <Link href={`/ro/cautare?tip=${encodeURIComponent(type)}`} className={styles.link}>
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={styles.colTitle}>Contact</h3>
            <ul className={styles.linkList}>
              <li>
                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} />
                  <span>bd. Ștefan cel Mare și Sfânt 168, Chișinău</span>
                </div>
              </li>
              <li>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <a href="tel:+37322250154" className={styles.contactLink}>+373 22 250 154</a>
                </div>
              </li>
              <li>
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <a href="mailto:info@justice.md" className={styles.contactLink}>info@justice.md</a>
                </div>
              </li>
            </ul>

            <div className={styles.extLinksSection}>
              <p className={styles.extLinksLabel}>Linkuri utile</p>
              <div className={styles.extLinks}>
                {[
                  { href: 'https://gov.md', label: 'Guvernul Republicii Moldova' },
                  { href: 'https://presedinte.md', label: 'Președinția' },
                  { href: 'https://justice.md', label: 'Ministerul Justiției' },
                ].map(({ href, label }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={styles.extLink}>
                    <ExternalLink className={styles.extLinkIcon} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <p>© {currentYear} Ministerul Justiției al Republicii Moldova. Toate drepturile rezervate.</p>
          <div className={styles.legalLinks}>
            <Link href="/ro/termeni" className={styles.legalLink}>Termeni de utilizare</Link>
            <Link href="/ro/confidentialitate" className={styles.legalLink}>Politica de confidențialitate</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
