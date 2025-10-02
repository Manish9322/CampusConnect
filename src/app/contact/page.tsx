import { PublicHeader } from '@/components/shared/public-header';
import { PublicFooter } from '@/components/shared/public-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader active="contact" />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get in Touch
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  We&apos;re here to help and answer any question you might have.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
