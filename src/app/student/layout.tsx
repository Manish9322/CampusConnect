
import { Header } from "@/components/shared/header";
import { StudentNav } from "@/components/student/student-nav";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { name: "Alice Johnson", email: "alice@example.com", initials: "AJ" };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <StudentNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title="Student Portal" user={user} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/40">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
