import Image from 'next/image';
import { BrainCircuit, FileText, Share2 } from 'lucide-react';

export function AiFeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              AI-Powered
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
              Intelligent Campus Management
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Leverage the power of artificial intelligence to gain deeper insights, automate administrative tasks, and create a smarter educational ecosystem.
            </p>
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Predictive Analytics</h3>
                  <p className="text-muted-foreground">
                    Forecast student performance and identify at-risk students early with powerful predictive models.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Automated Reporting</h3>
                  <p className="text-muted-foreground">
                    Generate comprehensive reports on attendance, grades, and academic progress automatically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Share2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Smart Resource Allocation</h3>
                  <p className="text-muted-foreground">
                    Optimize timetables and resource management based on data-driven suggestions from our AI engine.
                  </p>
                </div>
              </div>
            </div>
          </div>
           <div className="flex items-center justify-center">
            <Image
              src="https://placehold.co/550x550.png"
              width="550"
              height="550"
              alt="AI Feature"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="abstract technology brain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
