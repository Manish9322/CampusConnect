'use client';

export function AboutHero() {
  return (
    <section
      className="relative w-full py-20 md:py-32 lg:py-40 bg-cover bg-center"
      style={{
        backgroundImage: "url('https://picsum.photos/seed/about-hero/1200/600')",
      }}
    >
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl">
            Connecting the Future of Education
          </h1>
          <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
            We are dedicated to revolutionizing the educational experience by
            providing a seamless, unified platform for academic institutions.
          </p>
        </div>
      </div>
    </section>
  );
}
