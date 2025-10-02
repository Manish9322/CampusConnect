import { Rocket, Users, Shield, LifeBuoy } from 'lucide-react';

export function WhyChooseUsSection() {
  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: 'Innovative Technology',
      description: 'We leverage the latest AI and cloud technologies to provide a cutting-edge platform.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'User-Centric Design',
      description: 'Our platform is designed with students, teachers, and admins in mind for a seamless experience.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Scalable & Secure',
      description: 'Robust, secure, and scalable infrastructure that grows with your institution.',
    },
    {
      icon: <LifeBuoy className="h-8 w-8 text-primary" />,
      title: 'Dedicated Support',
      description: 'Our team is always here to help you get the most out of CampusConnect.',
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
            Why Choose Us
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            The CampusConnect Advantage
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover what makes our platform the leading choice for modern educational institutions.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center gap-4 group">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
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
