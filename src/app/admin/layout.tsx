import { AdminNav } from "@/components/admin/admin-nav";
import { Header } from "@/components/shared/header";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { name: "Admin User", email: "admin@campus.edu", initials: "AU" };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <AdminNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title="Admin Dashboard" user={user} showSidebarTrigger={true} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
