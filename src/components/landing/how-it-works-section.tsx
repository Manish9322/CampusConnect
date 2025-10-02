import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, LogIn, LayoutDashboard } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            A Seamless, Connected Experience
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform is designed for a simple, intuitive, and powerful user experience. Here's how you get started.
          </p>
        </div>
        <div className="mx-auto grid gap-8 md:grid-cols-3">
          <Card className="text-center bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  <UserPlus className="w-8 h-8" />
                </div>
              </div>
              <CardTitle>1. Create Your Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sign up in minutes. Select your role as a student, teacher, or administrator and get instant access to your portal.</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  <LogIn className="w-8 h-8" />
                </div>
              </div>
              <CardTitle>2. Access Your Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Log in to your personalized dashboard, where all your tools, classes, and information are waiting for you.</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
              </div>
              <CardTitle>3. Manage & Collaborate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Take attendance, track progress, communicate, and engage with your entire campus community effortlessly.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
