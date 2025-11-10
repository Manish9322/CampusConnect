
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="w-full relative overflow-hidden bg-primary">
      <div
        className="absolute inset-0 bg-repeat opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="relative container px-4 md:px-6 text-center py-16 md:py-20 lg:py-24">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700">
          <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl text-primary-foreground">
            Ready to Transform Your Campus?
          </h2>
          <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl my-6">
            Join leading institutions in streamlining operations, enhancing learning, and creating a smarter educational ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="text-base font-semibold px-8 py-6 shadow-lg transition-transform duration-300 hover:scale-105">
              <Link href="/login">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-base font-semibold px-8 py-6 shadow-lg transition-transform duration-300 hover:scale-105">
              <Link href="/contact">Request a Demo  </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
