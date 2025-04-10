
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/authContext';
import { 
  Home,
  Search,
  Bookmark,
  CalendarCheck2,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";

const DashboardSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isOwner = user?.role === 'restaurant_owner';
  
  const dinerLinks = [
    {
      to: '/dashboard',
      icon: <Home className="h-4 w-4 mr-2" />,
      label: 'Dashboard',
      exact: true
    },
    {
      to: '/dashboard/search',
      icon: <Search className="h-4 w-4 mr-2" />,
      label: 'Find Restaurants',
      exact: false
    },
    {
      to: '/dashboard/bookmarks',
      icon: <Bookmark className="h-4 w-4 mr-2" />,
      label: 'Bookmarks',
      exact: false
    },
    {
      to: '/dashboard/reservations',
      icon: <CalendarCheck2 className="h-4 w-4 mr-2" />,
      label: 'My Reservations',
      exact: false
    }
  ];
  
  const ownerLinks = [
    {
      to: '/owner-dashboard',
      icon: <Home className="h-4 w-4 mr-2" />,
      label: 'Dashboard',
      exact: true
    }
  ];
  
  const navLinks = isOwner ? ownerLinks : dinerLinks;
  
  const isActive = (path: string, exact: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="h-14 flex items-center px-4 border-b">
        <div className="flex items-center">
          <span className="font-semibold text-lg">DineFlow</span>
        </div>
        <SidebarTrigger className="ml-auto md:hidden">
          <ChevronRight className="h-4 w-4" />
        </SidebarTrigger>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-3 py-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </div>
          <SidebarMenu>
            {navLinks.map((link, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild isActive={isActive(link.to, link.exact)}>
                  <NavLink 
                    to={link.to}
                    className={({ isActive }) => 
                      isActive ? "text-primary" : "text-muted-foreground"
                    }
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="w-full flex items-center text-left text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>Profile</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="w-full flex items-center text-left text-muted-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button 
                  onClick={logout}
                  className="w-full flex items-center text-left text-muted-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
