'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Search, User, LogOut, Heart, ChevronDown,
  Scale, Globe, BookOpen, FileText, Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/useStore';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home'), icon: BookOpen },
    { href: `/${locale}/cautare`, label: t('search'), icon: Search },
    { href: `/${locale}/documente`, label: t('documents'), icon: FileText },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      {/* Pre-header – gov bar */}
      <div className={styles.preHeader}>
        <div className={styles.preHeaderInner}>
          <div className={styles.govLabel}>
            <Scale className={styles.govIcon} />
            <span>Republica Moldova — Portal Oficial Legislativ</span>
          </div>
          <div className={styles.langSwitcher}>
            <Globe className={styles.langIcon} />
            {['ro', 'ru'].map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`${styles.langBtn} ${locale === loc ? styles.langBtnActive : ''}`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={styles.mainNav}>
        <nav className={styles.navInner}>
          {/* Logo */}
          <Link href={`/${locale}`} className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Scale size={20} />
            </div>
            <div className={styles.logoText}>
              <p className={styles.logoTitle}>Portal Legislativ</p>
              <p className={styles.logoSubtitle}>Republica Moldova</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className={styles.desktopNav}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className={styles.actions}>
            <Link href={`/${locale}/cautare`} className={styles.iconBtn} aria-label="Caută">
              <Search size={16} />
            </Link>

            {user ? (
              <div ref={userMenuRef} className={styles.userMenuWrapper}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={styles.userMenuTrigger}
                >
                  <div className={styles.userAvatar}>
                    <User size={14} />
                  </div>
                  <span className={styles.userName}>{user.name}</span>
                  <ChevronDown className={`${styles.chevron} ${userMenuOpen ? styles.chevronOpen : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className={styles.dropdown}>
                    <Link href={`/${locale}/cont`} className={styles.dropdownItem}>
                      <User size={16} className={styles.dropdownItemIcon} /> Contul meu
                    </Link>
                    <Link href={`/${locale}/favorite`} className={styles.dropdownItem}>
                      <Heart size={16} className={styles.dropdownItemIcon} /> Favorite
                    </Link>
                    {user.role !== 'USER' && (
                      <Link href={`/${locale}/admin`} className={styles.dropdownItem}>
                        <Shield size={16} className={styles.dropdownItemIcon} /> Administrare
                      </Link>
                    )}
                    <hr className={styles.dropdownDivider} />
                    <button onClick={logout} className={styles.dropdownDanger}>
                      <LogOut size={16} /> {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href={`/${locale}/autentificare`} className={styles.loginBtn}>
                <User size={14} />
                {t('login')}
              </Link>
            )}

            <button
              className={styles.mobileToggle}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Meniu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuInner}>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileNavLink} ${isActive(href) ? styles.mobileNavLinkActive : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {!user && (
              <Link
                href={`/${locale}/autentificare`}
                onClick={() => setMobileOpen(false)}
                className={styles.mobileLoginBtn}
              >
                <User size={16} />
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
