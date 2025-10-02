import { BrainCircuit } from 'lucide-react';

export function AiFeatureSection() {
  return (
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
  );
}
