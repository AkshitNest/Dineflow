import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/store/authContext';
import OccupancyChart from '@/components/OccupancyChart';
import { getRestaurantById, getOccupancyData } from '@/services/restaurantService';
import BookingForm from '@/components/BookingForm';
import { AlertTriangle, BookOpen, Clock, MapPin, Phone, Star as StarIcon, Users, Utensils } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isOwner = user?.role === 'restaurant_owner';
  
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (!id) return;
        
        const data = await getRestaurantById(id);
        setRestaurant(data);
        
        const occupancy = await getOccupancyData(id);
        setOccupancyData(occupancy);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [id]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dineflow-purple"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!restaurant) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Restaurant Not Found</h2>
          <p className="text-muted-foreground mb-6">The restaurant you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/dashboard/search')}>Back to Search</Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const occupiedSeats = restaurant.occupied_seats;
  const totalSeats = restaurant.total_seats;
  const occupancyPercentage = Math.round((occupiedSeats / totalSeats) * 100);
  const estimatedWaitTime = restaurant.estimated_wait_time;
  
  const getOccupancyColor = () => {
    if (occupancyPercentage >= 80) return 'text-red-500';
    if (occupancyPercentage >= 50) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getProgressColor = () => {
    if (occupancyPercentage >= 80) return 'bg-red-500';
    if (occupancyPercentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const menuCategories = [
    {
      name: "Starters",
      items: [
        { name: "Bruschetta", description: "Toasted bread with tomatoes, garlic and basil", price: 8.99 },
        { name: "Calamari", description: "Crispy fried squid with marinara sauce", price: 12.99 },
        { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil", price: 10.99 }
      ]
    },
    {
      name: "Main Courses",
      items: [
        { name: "Spaghetti Carbonara", description: "Classic pasta with pancetta, eggs and cheese", price: 16.99 },
        { name: "Chicken Parmesan", description: "Breaded chicken with tomato sauce and mozzarella", price: 18.99 },
        { name: "Grilled Salmon", description: "With lemon butter sauce and seasonal vegetables", price: 22.99 }
      ]
    },
    {
      name: "Desserts",
      items: [
        { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 7.99 },
        { name: "Cannoli", description: "Crispy pastry tubes with sweet ricotta filling", price: 6.99 },
        { name: "Panna Cotta", description: "Italian cream dessert with berry compote", price: 8.99 }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="relative rounded-xl overflow-hidden h-64 mb-6">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant="outline" className="bg-white/20 text-white border-none">
                      {restaurant.cuisine}
                    </Badge>
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{restaurant.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-2" />
                      <span>Current Occupancy</span>
                    </div>
                    <span className={`font-semibold ${getOccupancyColor()}`}>
                      {occupancyPercentage}%
                    </span>
                  </div>
                  <Progress value={occupancyPercentage} className={`h-2 mt-2 ${getProgressColor()}`} />
                  <div className="text-sm text-gray-500 mt-2">
                    {occupiedSeats} / {totalSeats} seats
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Wait Time</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {estimatedWaitTime} min
                  </div>
                  <div className="text-sm text-gray-500">
                    Estimated waiting time
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-2" />
                    <span>Contact</span>
                  </div>
                  <div className="text-lg font-medium mt-2">
                    {restaurant.phone_number || "(555) 123-4567"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Call for inquiries
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                {isOwner && <TabsTrigger value="manage">Manage</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">About {restaurant.name}</h3>
                      <p className="text-gray-600">
                        {restaurant.name} is a charming {restaurant.cuisine} restaurant located in the heart of {restaurant.location}. 
                        Known for its exceptional service and authentic cuisine, it's a favorite among locals and tourists alike.
                        The restaurant features a warm and inviting atmosphere, perfect for both casual dining and special occasions.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Occupancy Trends</h3>
                      <div className="h-72">
                        <OccupancyChart data={occupancyData} />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                          <Utensils className="h-6 w-6 text-dineflow-purple mb-2" />
                          <span className="text-sm">Outdoor Seating</span>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                          <Users className="h-6 w-6 text-dineflow-purple mb-2" />
                          <span className="text-sm">Private Events</span>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                          <BookOpen className="h-6 w-6 text-dineflow-purple mb-2" />
                          <span className="text-sm">Reservation</span>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                          <Clock className="h-6 w-6 text-dineflow-purple mb-2" />
                          <span className="text-sm">Live Wait Times</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Operating Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monday - Thursday</span>
                          <span>11:00 AM - 10:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Friday - Saturday</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sunday</span>
                          <span>12:00 PM - 9:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="menu">
                <Card>
                  <CardContent className="pt-6">
                    {menuCategories.map((category, idx) => (
                      <div key={idx} className={idx > 0 ? 'mt-8' : ''}>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">{category.name}</h3>
                        <div className="space-y-6">
                          {category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              </div>
                              <div className="font-semibold">${item.price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6 text-center py-10">
                    <p className="text-muted-foreground">
                      Reviews will be available soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isOwner && (
                <TabsContent value="manage">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Restaurant Management</h3>
                        <p className="text-gray-600">
                          As the owner, you have access to additional management tools.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline">Edit Details</Button>
                          <Button variant="outline">Update Menu</Button>
                          <Button variant="outline">View Reservations</Button>
                          <Button variant="outline">Occupancy Settings</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6">
              <BookingForm 
                restaurantId={restaurant.id} 
                restaurantName={restaurant.name} 
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RestaurantDetail;
