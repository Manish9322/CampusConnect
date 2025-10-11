
"use client"

import { TeacherNav } from "@/components/teacher/teacher-nav";
import { Header } from "@/components/shared/header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { useGetTeachersQuery } from "@/services/api";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: teachers = [], isLoading } = useGetTeachersQuery();
  
  // Mocking logged in teacher as Dr. Alan Turing
  const teacher = teachers.find((t: { name: string; }) => t.name === 'Alan Turing');
  
  const user = teacher ? { 
    name: `${teacher.designation || ''} ${teacher.name}`, 
    email: teacher.email, 
    initials: `${teacher.designation?.charAt(0) || ''}${teacher.name.split(' ').map((n: string) => n[0]).join('')}`,
    profileImage: teacher.profileImage,
  } : {
    name: "Teacher",
    email: "teacher@example.com",
    initials: "T",
    profileImage: "",
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
