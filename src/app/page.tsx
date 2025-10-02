import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2, CalendarCheck, Users, GraduationCap, ArrowRight, CheckCircle2, Newspaper, Users2, BrainCircuit, BarChart, FileCheck, MessageSquare, User, Briefcase, School, UserPlus, LogIn, LayoutDashboard } from 'lucide-react';
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
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/about"
              className="hidden md:block transition-colors hover:text-primary-foreground/80"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hidden md:block transition-colors hover:text-primary-foreground/80"
            >
              Contact
            </Link>
             <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                   <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-primary">
                    The Future of Education Management
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                    Empowering Educational Institutions with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CampusConnect is an all-in-one, AI-driven platform that seamlessly connects students, teachers, and administrators to create a more efficient and engaging learning environment.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 shadow-lg">
                    <Link href="/login">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="shadow-sm">
                    <Link href="/contact">Request a Demo</Link>
                  </Button>
                </div>
                 <div className="grid grid-cols-3 gap-4 pt-6">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                           <School className="w-5 h-5 text-accent" />
                           <span className="text-2xl font-bold">50+</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Institutions</p>
                    </div>
                     <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                            <Users2 className="w-5 h-5 text-accent" />
                            <span className="text-2xl font-bold">10k+</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Users</p>
                    </div>
                     <div className="flex flex-col items-start gap-1">
                         <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-accent" />
                            <span className="text-2xl font-bold">1k+</span>
                         </div>
                        <p className="text-sm text-muted-foreground">Classes Managed</p>
                    </div>
                </div>
              </div>
               <div className="relative">
                  <Image
                    src="https://placehold.co/600x600.png"
                    width="600"
                    height="600"
                    alt="Campus"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last animate-in fade-in zoom-in-95 duration-500"
                    data-ai-hint="university students collaborating"
                  />
                  <div className="absolute -bottom-8 -right-8 w-48 hidden md:block">
                     <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <Avatar className="border-2 border-background h-10 w-10">
                                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="male portrait" />
                                    <AvatarFallback>U1</AvatarFallback>
                                </Avatar>
                                <Avatar className="border-2 border-background h-10 w-10">
                                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="female portrait" />
                                    <AvatarFallback>U2</AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">Trusted by leading educators worldwide.</p>
                        </div>
                    </div>
                  </div>
               </div>
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
                        A Seamless, Connected Experience
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Our platform is designed for a simple, intuitive, and powerful user experience. Here's how you get started.
                    </p>
                </div>
                <div className="mx-auto grid gap-8 md:grid-cols-3">
                     <Card className="text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                                    <UserPlus className="w-8 h-8" />
                                </div>
                            </div>
                            <CardTitle>1. Create Your Account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Sign up in minutes. Select your role as a student, teacher, or administrator and get instant access to your portal.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                         <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                                    <LogIn className="w-8 h-8" />
                                </div>
                            </div>
                            <CardTitle>2. Access Your Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground">Log in to your personalized dashboard, where all your tools, classes, and information are waiting for you.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                         <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                                    <LayoutDashboard className="w-8 h-8" />
                                </div>
                            </div>
                            <CardTitle>3. Manage & Collaborate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Take attendance, track progress, communicate, and engage with your entire campus community effortlessly.</p>
                        </CardContent>
                    </Card>
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
                         <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <span>AI-Powered Insights</span>
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

        {/* AI Feature Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">AI-Powered</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Intelligent Campus Management</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Leverage the power of AI to gain deeper insights and automate administrative tasks.
              </p>
            </div>
            <div className="relative grid gap-6 md:grid-cols-3">
               <div className="flex flex-col items-center gap-4">
                  <BrainCircuit className="w-12 h-12 text-accent" />
                  <div className="grid gap-1">
                      <h3 className="text-lg font-bold">Predictive Analytics</h3>
                      <p className="text-sm text-muted-foreground">Forecast student performance and identify at-risk students early.</p>
                  </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                  <BrainCircuit className="w-12 h-12 text-accent" />
                  <div className="grid gap-1">
                      <h3 className="text-lg font-bold">Automated Reporting</h3>
                      <p className="text-sm text-muted-foreground">Generate comprehensive reports on attendance and academic progress automatically.</p>
                  </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                  <BrainCircuit className="w-12 h-12 text-accent" />
                  <div className="grid gap-1">
                      <h3 className="text-lg font-bold">Smart Resource Allocation</h3>
                      <p className="text-sm text-muted-foreground">Optimize timetables and resource management based on data-driven suggestions.</p>
                  </div>
              </div>
            </div>
          </div>
        </section>


        {/* Testimonials Section */}
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

        {/* Latest News Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                Latest News
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Stay Updated
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Read our latest articles and discover new features.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src="https://placehold.co/550x310.png"
                  width="550"
                  height="310"
                  alt="News 1"
                  className="aspect-video object-cover"
                  data-ai-hint="education technology"
                />
                <CardHeader>
                  <CardTitle>The Future of Campus Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Discover how AI is shaping the future of education...</p>
                  <Button variant="link" className="px-0 mt-4">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src="https://placehold.co/550x310.png"
                  width="550"
                  height="310"
                  alt="News 2"
                  className="aspect-video object-cover"
                  data-ai-hint="students collaborating"
                />
                <CardHeader>
                  <CardTitle>New Feature: Parent Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">We're excited to launch our new portal for parents...</p>
                   <Button variant="link" className="px-0 mt-4">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </CardContent>
              </Card>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src="https://placehold.co/550x310.png"
                  width="550"
                  height="310"
                  alt="News 3"
                  className="aspect-video object-cover"
                  data-ai-hint="graduation ceremony"
                />
                <CardHeader>
                  <CardTitle>CampusConnect 2.0 is Here!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A completely redesigned experience with new features...</p>
                   <Button variant="link" className="px-0 mt-4">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                        Our Team
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Meet the Innovators
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        The passionate minds dedicated to improving education through technology.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="man ceo" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">John Doe</CardTitle>
                            <p className="text-sm text-muted-foreground">CEO & Founder</p>
                        </CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardContent className="pt-6">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="woman developer" />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">Jane Smith</CardTitle>
                            <p className="text-sm text-muted-foreground">Lead Developer</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="man designer" />
                                <AvatarFallback>MB</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">Mike Brown</CardTitle>
                            <p className="text-sm text-muted-foreground">UX/UI Designer</p>
                        </CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardContent className="pt-6">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="woman marketing" />
                                <AvatarFallback>SW</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">Sarah Wilson</CardTitle>
                            <p className="text-sm text-muted-foreground">Marketing Head</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>


        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
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
                         <AccordionItem value="item-4">
                            <AccordionTrigger>Is my data secure?</AccordionTrigger>
                            <AccordionContent>
                            Data security is our top priority. We use industry-standard encryption and security protocols to protect all your information.
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
