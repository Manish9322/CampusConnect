"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserCheck, CalendarCheck, Building2 } from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AdminNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/teachers", label: "Teachers", icon: UserCheck },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Building2 className="size-8 text-sidebar-primary" />
            <span
            className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden"
            >
            CampusConnect
            </span>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="w-full"
                >
                  <item.icon />
                  {state === 'expanded' && <span>{item.label}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
