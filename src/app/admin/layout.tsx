
"use client"

import { AdminNav } from "@/components/admin/admin-nav";
import { Header } from "@/components/shared/header";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "Admin User",
    email: "admin@campus.edu",
    initials: "AU",
    profileImage: "",
  });

  React.useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');

    if (!token || !storedUser) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/login');
        return;
      }
      setUser({
        name: parsedUser.name || "Admin",
        email: parsedUser.email || "admin@example.com",
        initials: parsedUser.name ? parsedUser.name.split(' ').map((n: string) => n[0]).join('') : "A",
        profileImage: parsedUser.profileImage || "",
      });
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
     return (
      <div className="flex h-screen">
        <div className="w-64 border-r p-4">
            <Skeleton className="h-8 w-3/4 mb-8" />
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
        </div>
        <div className="flex-1 flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
                <Skeleton className="h-6 w-48" />
                <div className="ml-auto flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </header>
            <main className="flex-1 p-8">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <AdminNav user={user} onLogout={() => {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            router.push('/');
        }}/>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <Header title="Admin Dashboard" user={user} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/40">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
