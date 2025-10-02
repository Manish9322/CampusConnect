import { Users, GraduationCap, CalendarCheck } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'For Students',
      description: 'Easily check your attendance, view grades, access class schedules, and communicate with teachers all in one place.',
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: 'For Teachers',
      description: 'Take attendance with a single click, manage your classes, post assignments, and communicate with students and parents effortlessly.',
    },
    {
      icon: <CalendarCheck className="h-10 w-10 text-primary" />,
      title: 'For Admins',
      description: 'Oversee all school operations, manage student and teacher data, view real-time analytics, and generate insightful reports.',
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              A Better Way to Manage Education
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides robust features for every role within
              your institution.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-12 mt-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12"
            >
              <div className={`flex justify-center ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                 <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
              </div>
              <div className={`space-y-4 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground md:text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
