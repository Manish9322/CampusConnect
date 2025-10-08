
'use client';

export function ContactHero() {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 bg-muted">
       <div
        className="absolute inset-0 bg-repeat opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="relative container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center animate-in fade-in slide-in-from-bottom-12 duration-700">
          <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            We&apos;re here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </div>
      </div>
    </section>
  );
}
