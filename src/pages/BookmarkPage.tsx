
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import RestaurantCard from '@/components/RestaurantCard';
import { bookmarkedRestaurants } from '@/store/restaurantData';
import { BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookmarkPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center space-x-2">
                <BookmarkCheck className="h-6 w-6 text-dineflow-purple" />
                <h1 className="text-2xl md:text-3xl font-bold">Bookmarked Restaurants</h1>
              </div>
              
              {bookmarkedRestaurants.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border">
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't bookmarked any restaurants yet.
                    Bookmark your favorite places to quickly find them later.
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/search">Find Restaurants</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BookmarkPage;
