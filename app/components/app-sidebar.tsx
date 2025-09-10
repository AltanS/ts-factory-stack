import * as React from 'react';
import { HomeIcon, Settings, Users, Layers, type LucideIcon } from 'lucide-react';
import type { SelectUser as User } from '#drizzle/schema';
import { NavUser } from '#app/components/nav-user';
import { cn } from '#app/lib/utils';
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
  useSidebar,
} from '#app/components/ui/sidebar';
import { Link, useLocation } from 'react-router';
import { userIsAdmin } from '#app/services/permissions';

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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className={cn('flex items-center gap-3 transition-all duration-200 ease-in-out', isCollapsed ? 'pl-0' : 'pl-4')}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
        <Layers className="h-5 w-5 text-zinc-100 dark:text-zinc-900" />
      </div>
      {!isCollapsed && <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">AppName</span>}
    </div>
  );
}

export function AppSidebar({ user }: { user: User } & React.ComponentProps<typeof Sidebar>) {
  const isAdmin = userIsAdmin(user);
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b">
        <div className="flex h-full items-center">
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
  );
}
