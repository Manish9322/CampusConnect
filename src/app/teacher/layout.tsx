
import { TeacherNav } from "@/components/teacher/teacher-nav";
import { Header } from "@/components/shared/header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { mockTeachers } from "@/lib/mock-data";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const teacher = mockTeachers.find(t => t.id === '101') || mockTeachers[0];
  const user = { 
    name: `${teacher.designation || ''} ${teacher.name}`, 
    email: teacher.email, 
    initials: `${teacher.designation?.charAt(0) || ''}${teacher.name.charAt(0)}`,
    profileImage: teacher.profileImage,
  };

  return (
    <SidebarProvider>
       <Sidebar collapsible="icon">
        <TeacherNav user={user} />
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
