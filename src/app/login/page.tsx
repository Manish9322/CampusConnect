import { LoginForm } from '@/components/auth/login-form';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
       <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-semibold text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
        </Link>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center space-x-4">
         
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Login to CampusConnect
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          The unified platform for students, teachers, and admins.
        </p>
      </div>
      <div className="mt-8 w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
