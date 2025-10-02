import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, CalendarCheck } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              A Better Way to Manage Education
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides robust features for every role within
              your institution.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
          <Card className="bg-background hover:bg-accent/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader className="flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">For Students</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-8 pb-8">
              <p className="text-muted-foreground">
                Easily check your attendance, view grades, access class schedules, and communicate
                with teachers all in one place.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background hover:bg-accent/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader className="flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">For Teachers</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-8 pb-8">
              <p className="text-muted-foreground">
                Take attendance with a single click, manage your classes, post assignments,
                and communicate with students and parents effortlessly.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background hover:bg-accent/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader className="flex flex-col items-center text-center p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <CalendarCheck className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">For Admins</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-8 pb-8">
              <p className="text-muted-foreground">
                Oversee all school operations, manage student and teacher
                data, view real-time analytics, and generate insightful reports.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
