import { BrainCircuit, FileText, Share2 } from 'lucide-react';

export function AiFeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            AI-Powered
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Intelligent Campus Management
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Leverage artificial intelligence to automate tasks, gain insights, and create a smarter educational ecosystem.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <div className="group flex items-start gap-6 transition-all duration-300">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Predictive Analytics</h3>
              <p className="mt-1 text-muted-foreground">
                Forecast student performance and identify at-risk students early with powerful predictive models.
              </p>
            </div>
          </div>
          <div className="my-8 border-t border-dashed border-border"></div>
          <div className="group flex items-start gap-6 transition-all duration-300">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Automated Reporting</h3>
              <p className="mt-1 text-muted-foreground">
                Generate comprehensive reports on attendance, grades, and academic progress automatically.
              </p>
            </div>
          </div>
           <div className="my-8 border-t border-dashed border-border"></div>
          <div className="group flex items-start gap-6 transition-all duration-300">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Share2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">Smart Resource Allocation</h3>
              <p className="mt-1 text-muted-foreground">
                Optimize timetables and resource management based on data-driven suggestions from our AI engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
