'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Scale, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useStore';
import { loginSchema, type LoginInput } from '@portal/shared';

export function LoginForm() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
      toast.success('Autentificat cu succes!');
      router.push(`/${locale}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Credențiale incorecte');
    }
  };

  return (
    <div className="card">
      <div className="flex flex-col items-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-900 mb-4">
          <Scale className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Autentificare</h1>
        <p className="text-muted-foreground text-sm mt-1">Portal Legislativ al Republicii Moldova</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <input type="email" {...register('email')} placeholder="email@exemplu.md" className="input" />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Parola</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} {...register('password')} placeholder="••••••••" className="input pr-10" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full h-11 text-base mt-2">
          {isLoading ? 'Se autentifică...' : 'Autentificare'}
        </button>
      </form>
    </div>
  );
}
