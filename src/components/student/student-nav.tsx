
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarCheck, BarChart2, BookOpen } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";

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
