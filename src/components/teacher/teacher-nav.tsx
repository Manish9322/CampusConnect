
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookCopy, CalendarCheck, LogOut, User as UserIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  useSidebar,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface TeacherNavProps {
    user: {
        name: string;
        email: string;
        initials: string;
    }
}

export function TeacherNav({ user }: TeacherNavProps) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  const menuItems = [
    { href: "/teacher", label: "Dashboard", icon: Home },
    { href: "/teacher/classes", label: "My Classes", icon: BookCopy },
    { href: "/teacher/students", label: "Students", icon: Users },
    { href: "/teacher/attendance", label: "Take Attendance", icon: CalendarCheck },
  ];

  return (
    <>
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
       {isMobile && (
           <>
            <SidebarSeparator />
             <SidebarFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://placehold.co/100x100.png" alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                             <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" align="end">
                        <DropdownMenuItem>
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
           </>
        )}
    </>
  );
}
