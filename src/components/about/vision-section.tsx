import Image from 'next/image';

export function VisionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 lg:order-last">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              Our Vision
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Shaping the Future of Learning.
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our vision is to create a globally connected educational ecosystem where technology
              and human potential converge. We aim to break down barriers, foster lifelong learning,
              and equip the next generation with the tools they need to build a better future.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://picsum.photos/seed/vision-image/550/400"
              width="550"
              height="400"
              alt="Our Vision"
              className="mx-auto overflow-hidden rounded-xl object-cover"
              data-ai-hint="futuristic cityscape"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
