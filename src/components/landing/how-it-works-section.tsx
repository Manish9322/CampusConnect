import { UserPlus, LogIn, LayoutDashboard } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: '1. Create Your Account',
      description: 'Sign up in minutes. Select your role as a student, teacher, or administrator and get instant access to your portal.',
    },
    {
      icon: <LogIn className="h-8 w-8" />,
      title: '2. Access Your Dashboard',
      description: 'Log in to your personalized dashboard, where all your tools, classes, and information are waiting for you.',
    },
    {
      icon: <LayoutDashboard className="h-8 w-8" />,
      title: '3. Manage & Collaborate',
      description: 'Take attendance, track progress, communicate, and engage with your entire campus community effortlessly.',
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
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
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border"></div>
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-center mb-16 last:mb-0">
              <div className={`flex w-full items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <h3 className="text-2xl font-bold text-primary">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 transform">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground ring-8 ring-muted">
                  {step.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}