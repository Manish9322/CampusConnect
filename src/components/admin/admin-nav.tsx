
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserCheck, CalendarCheck, Building2, BookCopy, PanelLeft } from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

export function AdminNav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/teachers", label: "Teachers", icon: UserCheck },
    { href: "/admin/classes", label: "Classes", icon: BookCopy },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  return (
    <>
      <SidebarHeader className="flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
            <Link href="/" className="flex items-center gap-2">
                <Building2 className="size-8 text-primary" />
                <span
                className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden"
                >
                CampusConnect
                </span>
            </Link>
        </div>
         <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 group-data-[collapsible=icon]:hidden"
            onClick={toggleSidebar}
        >
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="w-full"
                  asChild
                >
                  <a>
                    <item.icon />
                    {state === 'expanded' && <span>{item.label}</span>}
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
