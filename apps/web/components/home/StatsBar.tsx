import { FileText, BookOpen, Calendar, RefreshCw } from 'lucide-react';
import styles from './StatsBar.module.css';

const stats = [
  { label: 'Documente', value: '124,850+', icon: FileText, iconClass: styles.iconBlue },
  { label: 'Tipuri de acte', value: '48', icon: BookOpen, iconClass: styles.iconApricot },
  { label: 'Ani arhivă', value: '30+', icon: Calendar, iconClass: styles.iconGreen },
  { label: 'Actualizări zilnice', value: '~50', icon: RefreshCw, iconClass: styles.iconSky },
];

export function StatsBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {stats.map(({ label, value, icon: Icon, iconClass }) => (
            <div key={label} className={styles.statItem}>
              <div className={`${styles.iconWrap} ${iconClass}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className={styles.value}>{value}</p>
                <p className={styles.label}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
