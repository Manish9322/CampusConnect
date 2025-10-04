import { LoginForm } from '@/components/auth/login-form';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
        </Link>
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
