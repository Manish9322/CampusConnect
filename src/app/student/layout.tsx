
import { Header } from "@/components/shared/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = { name: "Alice Johnson", email: "alice@example.com", initials: "AJ" };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Student Portal" user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
