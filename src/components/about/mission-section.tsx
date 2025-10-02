import Image from 'next/image';

export function MissionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex justify-center">
            <Image
              src="https://picsum.photos/seed/mission-image/550/400"
              width="550"
              height="400"
              alt="Our Mission"
              className="mx-auto overflow-hidden rounded-xl object-cover"
              data-ai-hint="team brainstorming"
            />
          </div>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Empowering Education, Together.
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our mission is to empower students, teachers, and administrators with intuitive
              tools that foster collaboration, enhance learning, and simplify
              campus management. We believe in the power of technology to create
              a more connected and efficient educational environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
