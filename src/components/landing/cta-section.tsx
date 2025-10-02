import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container px-4 md:px-6 text-center animate-in fade-in slide-in-from-bottom-12 duration-500">
        <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
          Ready to Transform Your Campus?
        </h2>
        <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl my-6">
          Join leading institutions in streamlining operations, enhancing learning, and creating a smarter educational ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" variant="secondary" className="transition-transform duration-300 hover:scale-105">
            <Link href="/login">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
           <Button asChild size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-transform duration-300 hover:scale-105">
            <Link href="/contact">Request a Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
