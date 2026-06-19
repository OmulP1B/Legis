'use client';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';

export function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center gap-4 px-6">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Caută în admin..."
            className="input pl-9 h-8 text-sm bg-muted/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button className="relative h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-800">{user?.name?.charAt(0) ?? 'A'}</span>
          </div>
          <span className="text-sm font-medium hidden md:block">{user?.name ?? 'Administrator'}</span>
        </div>
      </div>
    </header>
  );
}
