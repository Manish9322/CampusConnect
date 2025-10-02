import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            What Our Users Say
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Hear from educators and students who have transformed their campus experience.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <blockquote className="text-lg">
                "CampusConnect has revolutionized how we manage attendance. It's saved us countless hours."
              </blockquote>
            </CardContent>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="male portrait" />
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Dr. Alan Turing</CardTitle>
                  <p className="text-sm text-muted-foreground">Head of Computer Science</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="text-lg">
                "As a student, it's so easy to keep track of my classes and grades. Everything is in one place!"
              </blockquote>
            </CardContent>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="female portrait" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Alice Johnson</CardTitle>
                  <p className="text-sm text-muted-foreground">Computer Science Student</p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="text-lg">
                "The admin dashboard gives us a complete overview of the entire institution at a glance. It's incredibly powerful."
              </blockquote>
            </CardContent>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person portrait" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">Admin User</CardTitle>
                  <p className="text-sm text-muted-foreground">University Administrator</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
