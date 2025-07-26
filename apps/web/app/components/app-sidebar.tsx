import * as React from "react"
import { HomeIcon, Settings, type LucideIcon } from "lucide-react"
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
import { NavLink } from 'react-router'
import { userIsAdmin } from '#app/services/permissions'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

type NavigationItem = {
  name: string;
  to: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
  adminOnly?: boolean;
};

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
];

function Logo() {
  return (
    <div className="flex items-center">
      <span className="text-lg font-bold text-sidebar-foreground">Your App</span>
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Check if dark mode is set
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0 text-sidebar-foreground"
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function AppSidebar({ user }: { user: User } & React.ComponentProps<typeof Sidebar>) {
  const isAdmin = userIsAdmin(user);
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b">
        <div className="flex h-full items-center justify-between px-2">
          <Logo />
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <NavLink
                      to={item.to}
                    >
                      {item.icon && <item.icon className="text-sidebar-foreground" />}
                      <span>{item.name}</span>
                    </NavLink>
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
