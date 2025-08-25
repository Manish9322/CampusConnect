
import { TeacherNav } from "@/components/teacher/teacher-nav";
import { Header } from "@/components/shared/header";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { name: "Dr. Alan Turing", email: "turing@example.com", initials: "AT" };

  return (
    <SidebarProvider>
       <Sidebar collapsible="icon">
        <SidebarHeader>
           <div className="p-2 flex items-center justify-center">
            <SidebarTrigger />
           </div>
        </SidebarHeader>
        <TeacherNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title="Teacher Portal" user={user} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/40">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
