
"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, UserCheck, CalendarCheck, BookCopy, LogOut, User as UserIcon, PanelLeft, ClipboardCheck, Settings, Megaphone, DollarSign, Calendar, ShieldAlert, Star } from "lucide-react";
import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  useSidebar,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface AdminNavProps {
    user: {
        name: string;
        email: string;
        initials: string;
        profileImage?: string;
    },
    onLogout: () => void;
}

export function AdminNav({ user, onLogout }: AdminNavProps) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/teachers", label: "Teachers", icon: UserCheck },
    { href: "/admin/classes", label: "Classes", icon: BookCopy },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/admin/timetable", label: "Timetable", icon: Calendar },
    { href: "/admin/fees", label: "Fee Management", icon: DollarSign },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star },
    { href: "/admin/complaints", label: "Complaints", icon: ShieldAlert },
    { href: "/admin/attendance-requests", label: "Attendance Requests", icon: ClipboardCheck },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft/>
              </Button>
            </SidebarTrigger>
            <div className={cn("flex-1 overflow-hidden whitespace-nowrap", state === 'collapsed' && 'hidden')}>
                <Link href="/" className="font-semibold text-lg">CampusConnect</Link>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
                className="w-full"
                asChild
              >
                <Link href={item.href}>
                  <item.icon />
                  {state === 'expanded' && <span>{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
            {isMobile ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profileImage} alt={user.name} />
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
                        <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        onClick={() => setLogoutDialogOpen(true)}
                        tooltip="Log out"
                        className="w-full"
                        >
                        <LogOut />
                        {state === 'expanded' && <span>Log out</span>}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )}
        </SidebarFooter>
        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                    You will be returned to the home page.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onLogout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
