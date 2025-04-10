
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import RestaurantCard from '@/components/RestaurantCard';
import { restaurants, Restaurant } from '@/store/restaurantData';
import { Search, SlidersHorizontal } from 'lucide-react';

const RestaurantSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [cuisine, setCuisine] = useState('all');
  const [maxOccupancy, setMaxOccupancy] = useState(100);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurants);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique locations
  const locations = ['all', ...new Set(restaurants.map(r => r.location))];
  
  // Get unique cuisines
  const cuisines = ['all', ...new Set(restaurants.map(r => r.cuisine))];
  
  // Filter restaurants based on search criteria
  useEffect(() => {
    let results = restaurants;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) || 
        restaurant.cuisine.toLowerCase().includes(query)
      );
    }
    
    // Filter by location
    if (location !== 'all') {
      results = results.filter(restaurant => restaurant.location === location);
    }
    
    // Filter by cuisine
    if (cuisine !== 'all') {
      results = results.filter(restaurant => restaurant.cuisine === cuisine);
    }
    
    // Filter by occupancy
    results = results.filter(restaurant => {
      const occupancyPercentage = (restaurant.occupiedSeats / restaurant.totalSeats) * 100;
      return occupancyPercentage <= maxOccupancy;
    });
    
    setFilteredRestaurants(results);
  }, [searchQuery, location, cuisine, maxOccupancy]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold">Find Restaurants</h1>
              
              {/* Search bar and filters toggle */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search restaurants by name or cuisine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={toggleFilters}
                  className="md:w-auto w-full"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              {/* Filters */}
              {showFilters && (
                <div className="bg-white rounded-lg border p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="location" className="mb-2 block">Location</Label>
                    <Select 
                      value={location} 
                      onValueChange={setLocation}
                    >
                      <SelectTrigger id="location" className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={loc} value={loc}>
                            {loc === 'all' ? 'All Locations' : loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cuisine" className="mb-2 block">Cuisine</Label>
                    <Select 
                      value={cuisine} 
                      onValueChange={setCuisine}
                    >
                      <SelectTrigger id="cuisine" className="w-full">
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisines.map(type => (
                          <SelectItem key={type} value={type}>
                            {type === 'all' ? 'All Cuisines' : type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="maxOccupancy">Maximum Occupancy</Label>
                      <span className="text-sm text-muted-foreground">{maxOccupancy}%</span>
                    </div>
                    <Slider
                      id="maxOccupancy"
                      value={[maxOccupancy]}
                      onValueChange={(values) => setMaxOccupancy(values[0])}
                      max={100}
                      step={10}
                    />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Results */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Results ({filteredRestaurants.length})
                  </h2>
                  {filteredRestaurants.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min(filteredRestaurants.length, 12)} of {filteredRestaurants.length} restaurants
                    </div>
                  )}
                </div>
                
                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border">
                    <div className="text-3xl mb-2">🍽️</div>
                    <h3 className="text-lg font-medium mb-1">No restaurants found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map(restaurant => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RestaurantSearch;
