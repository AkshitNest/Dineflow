
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/store/authContext';

const DashboardHeader = () => {
  const { user } = useAuth();
  
  // Extract first letters of the user's name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center">
        <SidebarTrigger />
        <div className="ml-4 hidden md:block">
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>
      </div>
      
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            className="pl-10 w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-dineflow-orange rounded-full" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
            )}
          </Avatar>
          <span className="hidden md:inline-block font-medium text-sm">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
