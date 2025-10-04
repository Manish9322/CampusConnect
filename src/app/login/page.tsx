import { LoginForm } from '@/components/auth/login-form';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center gap-8 bg-primary text-primary-foreground p-12 text-center">
         <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-semibold text-primary-foreground">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
        </Link>
        <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
                The unified platform for students, teachers, and admins. Your educational journey, simplified.
            </p>
        </div>
        <Image
          src="https://picsum.photos/seed/login-art/500/500"
          width={500}
          height={500}
          alt="Abstract art representing connection"
          className="rounded-xl object-cover"
          data-ai-hint="abstract illustration"
        />
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
         <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 font-semibold text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
        </Link>
        <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center text-primary mb-2 lg:hidden">Welcome Back!</h2>
            <LoginForm />
        </div>
      </div>
    </main>
  );
}
