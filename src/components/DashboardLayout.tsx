
import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '@/store/authContext';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const isRestaurantOwner = user?.role === 'restaurant_owner';

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row w-full">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
