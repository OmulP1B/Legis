import Link from 'next/link';
import { FileText, Scale, Landmark, Briefcase, GraduationCap, Heart } from 'lucide-react';
import styles from './CategoryGrid.module.css';

const categories = [
  { label: 'Legi', count: '4,200+', icon: Scale, href: '/ro/cautare?tip=Lege', colorClass: styles.colorBlue },
  { label: 'Hotărâri Guvern', count: '18,500+', icon: Landmark, href: '/ro/cautare?tip=Hotarare+Guvern', colorClass: styles.colorApricot },
  { label: 'Ordine ministeriale', count: '45,000+', icon: FileText, href: '/ro/cautare?tip=Ordin', colorClass: styles.colorSky },
  { label: 'Dreptul Muncii', count: '3,100+', icon: Briefcase, href: '/ro/cautare?q=munca', colorClass: styles.colorGreen },
  { label: 'Educație', count: '2,800+', icon: GraduationCap, href: '/ro/cautare?q=educatie', colorClass: styles.colorLavender },
  { label: 'Sănătate', count: '5,400+', icon: Heart, href: '/ro/cautare?q=sanatate', colorClass: styles.colorRed },
];

export function CategoryGrid() {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Categorii principale</h2>
      <div className={styles.grid}>
        {categories.map(({ label, count, icon: Icon, href, colorClass }) => (
          <Link
            key={label}
            href={href}
            className={`${styles.categoryItem} ${colorClass}`}
          >
            <Icon size={20} />
            <div>
              <p className={styles.categoryItemLabel}>{label}</p>
              <p className={styles.categoryItemCount}>{count}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
