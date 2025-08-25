
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarCheck, BarChart2, BookOpen, Building2 } from "lucide-react";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function StudentNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const menuItems = [
    { href: "/student", label: "Dashboard", icon: Home },
    { href: "/student/attendance", label: "My Attendance", icon: CalendarCheck },
    { href: "/student/schedule", label: "Class Schedule", icon: BookOpen },
    { href: "/student/reports", label: "Reports", icon: BarChart2 },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="p-2 w-full flex items-center justify-between">
           <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            {state === 'expanded' && <span className="text-xl font-bold">CampusConnect</span>}
           </div>
        </div>
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
