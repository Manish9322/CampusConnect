'use client';

import { GraduationCap, Lightbulb, ShieldCheck } from 'lucide-react';

const commitments = [
  {
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    title: 'Student Success',
    description:
      'We are dedicated to providing tools and resources that empower students to achieve their academic and personal goals.',
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: 'Continuous Innovation',
    description:
      'We constantly evolve our platform based on student feedback to create a more intuitive and effective learning experience.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'A Supportive Community',
    description:
      'We foster a collaborative and secure environment where students can connect, learn, and thrive together.',
  },
];

export function CommitmentSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our Commitment to Students
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            At the heart of our mission is a steadfast dedication to the student experience.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {commitments.map((commitment) => (
            <div
              key={commitment.title}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                {commitment.icon}
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{commitment.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {commitment.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
