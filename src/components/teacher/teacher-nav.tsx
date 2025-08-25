
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookCopy, PanelLeft } from "lucide-react";

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

export function TeacherNav() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  const menuItems = [
    { href: "/teacher", label: "Dashboard", icon: Home },
    { href: "/teacher/classes", label: "My Classes", icon: BookCopy },
    { href: "/teacher/students", label: "Students", icon: Users },
  ];

  return (
    <>
      <SidebarHeader className="flex h-16 items-center justify-end p-4">
         <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
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
                  isActive={pathname.startsWith(item.href) && (item.href !== '/teacher' || pathname === '/teacher')}
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
