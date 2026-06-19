import { PublicLayout } from '@/components/layout/PublicLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Autentificare' };

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <LoginForm />
        </div>
      </div>
    </PublicLayout>
  );
}
