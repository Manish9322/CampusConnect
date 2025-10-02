import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

        <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MonitorSmartphone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Real-time Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor student attendance instantly with our cross-platform attendance system.
              </p>
            </CardContent>
          </Card>
          <Card className="group bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <DatabaseZap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Centralized Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A single source of truth for all student, teacher, and class information.
              </p>
            </CardContent>
          </Card>
          <Card className="group bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BellRing className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Automated Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up automated notifications for low attendance, important announcements, and more.
              </p>
            </CardContent>
          </Card>
          <Card className="group bg-background/50 hover:bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gain actionable insights into campus trends and student performance with AI analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
