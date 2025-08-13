"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Music,
  Home,
  Search,
  Library,
  Heart,
  Settings,
  User,
  LogOut,
  ChevronUp,
  Clock,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { FloatingPlayer } from "@/components/music-player/floating-player";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { title: "Home", icon: Home, url: "/dashboard" },
  { title: "Songs", icon: Music, url: "/dashboard/songs" },
  { title: "Playlists", icon: Library, url: "/dashboard/playlists" },
  { title: "Play Logs", icon: Clock, url: "/dashboard/playlogs" },

  //   { title: 'Liked Songs', icon: Heart, url: '/dashboard/liked' },
  { title: "Settings", icon: Settings, url: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center gap-2 p-4">
              <Music className="w-8 h-8 text-purple-600" />
              <span className="font-bold text-lg">MusicVerse</span>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full">
              <User className="w-4 h-4 text-white" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 min-w-0 text-left hover:bg-accent rounded-md p-1">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">
                    john.doe@example.com
                  </p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between gap-2 px-4 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">{pathname === '/dashboard' ? 'Dashboard' : menuItems.find(item => item.url === pathname)?.title || 'Dashboard'}</h1>
          </div>
          <NotificationDropdown />
        </header>
        <main className="flex-1 p-6">{children}</main>
        <FloatingPlayer />
      </SidebarInset>
    </SidebarProvider>
  );
}
