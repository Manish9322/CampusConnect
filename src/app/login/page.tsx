
"use client";

import { LoginForm } from '@/components/auth/login-form';
import { Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
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
