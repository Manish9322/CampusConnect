import { MonitorSmartphone, DatabaseZap, BellRing, LineChart } from 'lucide-react';

export function PowerfulToolsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Powerful Tools
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Streamline Campus Operations
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            From attendance tracking to data analytics, CampusConnect provides a comprehensive suite of tools to enhance efficiency and collaboration.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <MonitorSmartphone className="h-8 w-8" />
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Real-time Attendance</h3>
              <p className="text-sm text-muted-foreground">
                Monitor student attendance instantly with our cross-platform attendance system.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <DatabaseZap className="h-8 w-8" />
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Centralized Database</h3>
              <p className="text-sm text-muted-foreground">
                A single source of truth for all student, teacher, and class information.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 group">
             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <BellRing className="h-8 w-8" />
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Automated Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Set up automated notifications for low attendance, important announcements, and more.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 group">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <LineChart className="h-8 w-8" />
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Gain actionable insights into campus trends and student performance with AI analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
