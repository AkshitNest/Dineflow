
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import OccupancyChart from '@/components/OccupancyChart';
import { getRestaurantById, getOccupancyData } from '@/store/restaurantData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, Phone, Clock, Star, DollarSign, Globe, BookOpen } from 'lucide-react';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get restaurant data
  const restaurant = id ? getRestaurantById(id) : undefined;
  
  // Get occupancy data for chart
  const occupancyData = id ? getOccupancyData(id) : [];
  
  // Calculate occupancy percentage
  const occupancyPercentage = restaurant 
    ? Math.round((restaurant.occupiedSeats / restaurant.totalSeats) * 100)
    : 0;
  
  // Determine the color of the progress bar based on occupancy
  const getProgressColor = () => {
    if (occupancyPercentage >= 80) return 'bg-red-500';
    if (occupancyPercentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  // If restaurant not found
  if (!restaurant) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="mb-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                
                <Alert>
                  <AlertDescription>
                    Restaurant not found. The restaurant you're looking for might have been removed or doesn't exist.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6 text-center">
                  <Button asChild>
                    <Link to="/dashboard/search">Browse Restaurants</Link>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 overflow-auto">
            {/* Restaurant header image */}
            <div className="h-64 md:h-80 w-full relative">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="absolute bottom-4 right-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Restaurant details */}
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {restaurant.cuisine}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {restaurant.priceRange}
                          </span>
                        </div>
                        
                        <p className="text-gray-600">
                          {restaurant.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <div>
                          <h3 className="font-medium mb-2">Contact & Location</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                              <span>{restaurant.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{restaurant.phoneNumber}</span>
                            </div>
                            {restaurant.website && (
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                                <a 
                                  href={restaurant.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-dineflow-purple hover:underline"
                                >
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Hours</h3>
                          <div className="flex items-start text-sm">
                            <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                            <span>{restaurant.hours}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Current Occupancy</h3>
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Seats occupied</span>
                            <span className="font-medium">{restaurant.occupiedSeats} / {restaurant.totalSeats} seats ({occupancyPercentage}%)</span>
                          </div>
                          <Progress value={occupancyPercentage} className="h-2" indicatorClassName={getProgressColor()} />
                          
                          <div className="mt-4 text-sm">
                            <div className="flex justify-between">
                              <span>Estimated wait time</span>
                              <span className="font-medium">{restaurant.estimatedWaitTime} minutes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Occupancy Trend</h3>
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <OccupancyChart data={occupancyData} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div>
                      <div className="sticky top-6 space-y-6">
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Make a Reservation</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Secure your table now and skip the wait!
                            </p>
                            <Button className="w-full mb-3">Book Now</Button>
                            <p className="text-xs text-center text-gray-500">
                              No payment required to reserve
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold">Best Times to Visit</h3>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Monday</span>
                                <span className="font-medium text-green-600">Low traffic</span>
                              </div>
                              <Progress value={30} className="h-1.5 mt-1" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Tuesday - Thursday</span>
                                <span className="font-medium text-amber-600">Moderate</span>
                              </div>
                              <Progress value={60} className="h-1.5 mt-1" indicatorClassName="bg-amber-500" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Friday - Sunday</span>
                                <span className="font-medium text-red-600">High traffic</span>
                              </div>
                              <Progress value={90} className="h-1.5 mt-1" indicatorClassName="bg-red-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RestaurantDetail;
