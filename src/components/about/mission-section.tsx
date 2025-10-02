import Image from 'next/image';

export function MissionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Our Mission
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            To empower students, teachers, and administrators with intuitive
            tools that foster collaboration, enhance learning, and simplify
            campus management. We believe in the power of technology to create
            a more connected and efficient educational environment.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://picsum.photos/seed/1/550/310"
            width="550"
            height="310"
            alt="Our Mission"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            data-ai-hint="team collaboration"
          />
        </div>
      </div>
    </section>
  );
}
