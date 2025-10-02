import { UserPlus, LogIn, LayoutDashboard } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-10 w-10 text-primary" />,
      title: '1. Create Your Account',
      description: 'Sign up in minutes. Select your role as a student, teacher, or administrator and get instant access to your portal.',
    },
    {
      icon: <LogIn className="h-10 w-10 text-primary" />,
      title: '2. Access Your Dashboard',
      description: 'Log in to your personalized dashboard, where all your tools, classes, and information are waiting for you.',
    },
    {
      icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
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
        <div className="mx-auto grid max-w-5xl items-center gap-12 mt-16">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12"
            >
              <div className={`flex justify-center ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                 <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  {step.icon}
                </div>
              </div>
              <div className={`space-y-4 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground md:text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
