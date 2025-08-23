import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, CalendarCheck, Users, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">CampusConnect</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/about"
              className="transition-colors hover:text-primary-foreground/80"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-primary-foreground/80"
            >
              Contact
            </Link>
             <Link
              href="/login"
              className="transition-colors hover:text-primary-foreground/80"
            >
              Login
            </Link>
          </nav>
          <Button className="md:hidden" variant="ghost" size="icon" asChild>
            <Link href="/login">
                <Users className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                    Welcome to CampusConnect
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The all-in-one platform for managing your campus life.
                    Seamlessly connect students, teachers, and administrators.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                    <Link href="/login">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/contact">Request a Demo</Link>
                  </Button>
                </div>
              </div>
               <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Campus"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="university campus"
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                        How It Works
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Get Started in 3 Easy Steps
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Our platform is designed to be intuitive and easy to use.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <span className="text-2xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                        <p className="text-muted-foreground">Create an account as a student, teacher, or administrator.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-2xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Login to Your Portal</h3>
                        <p className="text-muted-foreground">Access your personalized dashboard with all the tools you need.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                           <span className="text-2xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Manage & Connect</h3>
                        <p className="text-muted-foreground">Engage with your campus community effortlessly.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
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
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                  <Users className="h-10 w-10 mb-4 text-accent" />
                  <CardTitle>For Students</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Easily check your attendance, view grades, and communicate
                    with teachers.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                  <GraduationCap className="h-10 w-10 mb-4 text-accent" />
                  <CardTitle>For Teachers</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Take attendance, manage your classes, and post assignments
                    all in one place.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-col items-center text-center">
                   <CalendarCheck className="h-10 w-10 mb-4 text-accent" />
                  <CardTitle>For Admins</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>
                    Oversee all school operations, manage student and teacher
                    data, and view analytics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Detailed Features */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                        Powerful Tools
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                        Streamline Campus Operations
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        From attendance tracking to data analytics, CampusConnect provides a comprehensive suite of tools to enhance efficiency and collaboration.
                    </p>
                    <ul className="grid gap-4">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <span>Real-time attendance monitoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <span>Centralized student & teacher database</span>
                        </li>
                         <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <span>Automated notifications and alerts</span>
                        </li>
                    </ul>
                </div>
                <div className="flex justify-center">
                    <Image
                        src="https://placehold.co/550x310.png"
                        width="550"
                        height="310"
                        alt="Feature"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                        data-ai-hint="dashboard analytics"
                    />
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
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
                                    <AvatarImage src="https://placehold.co/40x40.png" />
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
                                    <AvatarImage src="https://placehold.co/40x40.png" />
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
                                    <AvatarImage src="https://placehold.co/40x40.png" />
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

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                </div>
                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Is CampusConnect suitable for large universities?</AccordionTrigger>
                            <AccordionContent>
                            Yes, CampusConnect is built to scale and can support institutions of all sizes, from small colleges to large universities with thousands of users.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
                            <AccordionContent>
                            We offer 24/7 email support, along with dedicated onboarding and training for administrators and teachers to ensure a smooth transition.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Can we integrate CampusConnect with our existing systems?</AccordionTrigger>
                            <AccordionContent>
                            Absolutely. We provide APIs and support for integrating with various Student Information Systems (SIS) and other campus software.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>

        {/* CTA Section */}
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

      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 CampusConnect. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
