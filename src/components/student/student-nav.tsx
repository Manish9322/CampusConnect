

"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarCheck, BarChart2, BookOpen, LogOut, User as UserIcon, Building2, PanelLeft, DollarSign } from "lucide-react";
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

interface StudentNavProps {
    user: {
        name: string;
        email: string;
        initials: string;
    }
}

export function StudentNav({ user }: StudentNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const menuItems = [
    { href: "/student", label: "Dashboard", icon: Home },
    { href: "/student/attendance", label: "My Attendance", icon: CalendarCheck },
    { href: "/student/schedule", label: "Class Schedule", icon: BookOpen },
    { href: "/student/fees", label: "Fees", icon: DollarSign },
    { href: "/student/reports", label: "Reports", icon: BarChart2 },
  ];

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <>
       <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft/>
              </Button>
            </SidebarTrigger>
            <div className="flex-1 overflow-hidden whitespace-nowrap">
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
                <AlertDialogAction onClick={handleLogout}>Log Out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
