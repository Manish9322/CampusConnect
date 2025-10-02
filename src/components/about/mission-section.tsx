
'use client';
import Image from 'next/image';

export function MissionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="animate-in fade-in slide-in-from-left-12 duration-700">
            <Image
              src="https://picsum.photos/seed/mission-v2/600/600"
              width="600"
              height="600"
              alt="Our Mission"
              className="mx-auto overflow-hidden rounded-xl object-cover"
              data-ai-hint="abstract geometric shapes"
            />
          </div>
          <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700 delay-200">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Empowering Education, Together.
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our mission is to empower students, teachers, and administrators with{' '}
              <span className="text-accent font-semibold">intuitive tools</span> that foster{' '}
              <span className="text-accent font-semibold">collaboration</span>, enhance learning, and simplify
              campus management. We believe in the power of{' '}
              <span className="text-accent font-semibold">technology</span> to create
              a more connected and efficient educational environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
