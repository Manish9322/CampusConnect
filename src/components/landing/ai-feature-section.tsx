import Image from 'next/image';
import { BrainCircuit, FileText, Share2 } from 'lucide-react';

export function AiFeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 dark:bg-muted/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            AI-Powered
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Intelligent Campus Management
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Leverage artificial intelligence to automate tasks, gain insights, and create a smarter educational ecosystem.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-1 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-150"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BrainCircuit className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Predictive Analytics</h3>
              <p className="mt-2 text-muted-foreground">
                Forecast student performance and identify at-risk students early with powerful predictive models.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
             <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-150"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Automated Reporting</h3>
              <p className="mt-2 text-muted-foreground">
                Generate comprehensive reports on attendance, grades, and academic progress automatically.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-150"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Share2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Smart Resource Allocation</h3>
              <p className="mt-2 text-muted-foreground">
                Optimize timetables and resource management based on data-driven suggestions from our AI engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
