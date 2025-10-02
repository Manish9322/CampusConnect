import { Lightbulb, ShieldCheck, Users, Award } from 'lucide-react';

export function CoreValuesSection() {
  const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'We constantly seek to improve and innovate, pushing the boundaries of what\'s possible in educational technology.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Integrity',
      description: 'We operate with transparency and honesty, ensuring the trust of our partners and users is always our top priority.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Collaboration',
      description: 'We believe in the power of working together, fostering a community where ideas are shared and everyone can succeed.',
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Excellence',
      description: 'We are committed to delivering the highest quality platform and services, striving for excellence in everything we do.',
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Our Core Values
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            The Principles That Guide Us
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Our values are the foundation of our culture and the driving force behind our commitment to transforming education.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col items-center text-center gap-4 group">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {value.icon}
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
