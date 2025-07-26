import * as React from "react"
import { HomeIcon, Settings, Users, type LucideIcon } from "lucide-react"
import type { InsertUser as User } from '#drizzle/schema'
import { NavUser } from "#app/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "#app/components/ui/sidebar"
import { Link, useLocation } from 'react-router'
import { userIsAdmin } from '#app/services/permissions'

type NavigationItem = {
  name: string;
  to: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
  adminOnly?: boolean;
};

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Settings', to: '/settings', icon: Settings },
  { name: 'Users', to: '/users', icon: Users, adminOnly: true },
];

function Logo() {
  return (
    <div className="flex items-center">
      <span className="text-lg font-bold text-sidebar-foreground">Your App</span>
    </div>
  );
}

export function AppSidebar({ user }: { user: User } & React.ComponentProps<typeof Sidebar>) {
  const isAdmin = userIsAdmin(user);
  const location = useLocation();
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b">
        <div className="flex h-full items-center px-4">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              const isActive = location.pathname === item.to;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.to}>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
