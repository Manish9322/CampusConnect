
'use client';

export function MissionSection() {
  return (
    <section className="relative w-full overflow-hidden bg-muted/50 py-12 md:py-24 lg:py-32">
      <div
        className="absolute inset-0 bg-repeat opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
            Our Mission
          </div>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Empowering Education, Together.
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl/relaxed">
            Our mission is to empower students, teachers, and administrators with{' '}
            <span className="text-accent font-semibold">intuitive tools</span> that foster{' '}
            <span className="text-accent font-semibold">collaboration</span>, enhance learning, and simplify
            campus management. We believe in the power of{' '}
            <span className="text-accent font-semibold">technology</span> to create
            a more connected and efficient educational environment for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
