import { LoginForm } from '@/components/auth/login-form';
import { Building2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex items-center space-x-4">
          <Building2 className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            CampusConnect
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
