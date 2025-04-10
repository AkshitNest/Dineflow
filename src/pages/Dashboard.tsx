
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/store/authContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import RestaurantCard from '@/components/RestaurantCard';
import { bookmarkedRestaurants } from '@/store/restaurantData';
import { MapPin, Utensils, Clock, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const currentTime = new Date();
  const hours = currentTime.getHours();
  
  let greeting = 'Good evening';
  if (hours < 12) {
    greeting = 'Good morning';
  } else if (hours < 18) {
    greeting = 'Good afternoon';
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Welcome section */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{greeting}, {user?.name}</h1>
                <p className="text-gray-600">Here's what's happening with your bookmarked restaurants today.</p>
              </div>
              
              {/* Quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Utensils className="h-5 w-5 text-dineflow-purple" />
                      </div>
                      <h3 className="font-medium">Popular Nearby</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">23 restaurants</div>
                    <p className="text-sm text-gray-500">With low wait times</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Clock className="h-5 w-5 text-dineflow-orange" />
                      </div>
                      <h3 className="font-medium">Avg. Wait Time</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">~18 minutes</div>
                    <p className="text-sm text-gray-500">In your area</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <MapPin className="h-5 w-5 text-blue-500" />
                      </div>
                      <h3 className="font-medium">Your Location</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">New York</div>
                    <p className="text-sm text-gray-500">10001 · Change</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Bookmarked Restaurants */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Bookmarked Restaurants</h2>
                  <Link to="/dashboard/bookmarks">
                    <Button variant="ghost" className="text-dineflow-purple">View All</Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {bookmarkedRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
              
              {/* Find New Restaurants */}
              <Card className="bg-gradient-to-br from-dineflow-purple to-dineflow-light-purple text-white">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">Discover New Places</h3>
                    <p className="text-white/80">Find restaurants with real-time availability near you</p>
                  </div>
                  <Link to="/dashboard/search">
                    <Button className="bg-white text-dineflow-purple hover:bg-gray-100">
                      <Search className="h-4 w-4 mr-2" />
                      Search Restaurants
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
