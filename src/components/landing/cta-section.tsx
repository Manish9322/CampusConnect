import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to Transform Your Campus?
        </h2>
        <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl my-4">
          Join leading institutions in streamlining your operations and enhancing the educational experience.
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/login">Get Started for Free</Link>
        </Button>
      </div>
    </section>
  );
}
