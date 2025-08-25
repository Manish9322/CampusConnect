
import { AdminNav } from "@/components/admin/admin-nav";
import { Header } from "@/components/shared/header";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar";
import { Building2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { name: "Admin User", email: "admin@campus.edu", initials: "AU" };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
           <div className="p-2 flex items-center justify-center">
            <SidebarTrigger />
           </div>
        </SidebarHeader>
        <AdminNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title="Admin Dashboard" user={user} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
