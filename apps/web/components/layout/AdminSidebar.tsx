'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  LayoutDashboard, FileText, Users, Settings,
  ClipboardList, BarChart3, FolderOpen, Scale,
  ChevronLeft, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useStore';

const navItems = [
  { href: '/admin', label: 'Panou principal', icon: LayoutDashboard, exact: true },
  { href: '/admin/documente', label: 'Documente', icon: FileText },
  { href: '/admin/utilizatori', label: 'Utilizatori', icon: Users },
  { href: '/admin/setari', label: 'Setări', icon: Settings },
  { href: '/admin/loguri', label: 'Jurnale', icon: ClipboardList },
  { href: '/admin/rapoarte', label: 'Rapoarte', icon: BarChart3 },
  { href: '/admin/fisiere', label: 'Fișiere', icon: FolderOpen },
];

export function AdminSidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string, exact = false) => {
    const full = `/${locale}${href}`;
    return exact ? pathname === full : pathname.startsWith(full);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">Portal Legislativ</p>
          <p className="text-xs text-muted-foreground mt-0.5">Administrare</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <li key={href}>
              <Link
                href={`/${locale}${href}`}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(href, exact)
                    ? 'bg-primary-50 text-primary-900 border-l-2 border-primary-900'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-800">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name ?? 'Administrator'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${locale}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            Portal
          </Link>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-xs text-danger hover:bg-danger-light transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Ieșire
          </button>
        </div>
      </div>
    </aside>
  );
}
