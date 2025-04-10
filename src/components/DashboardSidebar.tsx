
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  Home,
  Search,
  BookmarkCheck,
  Settings,
  Calendar,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/store/authContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactElement;
  children: React.ReactNode;
  isActive: boolean;
}

const SidebarLink = ({ to, icon, children, isActive }: SidebarLinkProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild active={isActive}>
        <Link to={to} className="flex items-center">
          {React.cloneElement(icon, {
            className: 'mr-2 h-5 w-5'
          })}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const path = location.pathname;
  
  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-3 py-4">
          <Link to="/" className="flex items-center mb-4">
            <span className="text-dineflow-purple font-bold text-xl mr-1">Dine</span>
            <span className="font-bold text-xl">flow</span>
          </Link>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink to="/dashboard" icon={<Home />} isActive={path === '/dashboard'}>
                Dashboard
              </SidebarLink>
              <SidebarLink to="/dashboard/search" icon={<Search />} isActive={path === '/dashboard/search'}>
                Find Restaurants
              </SidebarLink>
              <SidebarLink to="/dashboard/bookmarks" icon={<BookmarkCheck />} isActive={path === '/dashboard/bookmarks'}>
                Bookmarked
              </SidebarLink>
              <SidebarLink to="/dashboard/reservations" icon={<Calendar />} isActive={path === '/dashboard/reservations'}>
                Reservations
              </SidebarLink>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink to="/dashboard/notifications" icon={<Bell />} isActive={path === '/dashboard/notifications'}>
                Notifications
              </SidebarLink>
              <SidebarLink to="/dashboard/settings" icon={<Settings />} isActive={path === '/dashboard/settings'}>
                Settings
              </SidebarLink>
              <SidebarLink to="/dashboard/help" icon={<HelpCircle />} isActive={path === '/dashboard/help'}>
                Help & Support
              </SidebarLink>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <button 
            onClick={() => logout()}
            className="flex items-center w-full px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
