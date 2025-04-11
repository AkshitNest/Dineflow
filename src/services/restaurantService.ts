
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Get all restaurants
export const getAllRestaurants = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    
    if (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        title: "Error fetching restaurants",
        description: error.message,
        variant: "destructive",
      });
      return []; // Return empty array to prevent app from crashing
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getAllRestaurants:', err);
    return []; // Return empty array to prevent app from crashing
  }
};

// Get restaurant by ID
export const getRestaurantById = async (id: string) => {
  try {
    console.log('Fetching restaurant with ID:', id);
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching restaurant:', error);
      toast({
        title: "Error fetching restaurant details",
        description: error.message,
        variant: "destructive",
      });
      
      // Return mock data if the real data cannot be fetched
      return getMockRestaurantById(id);
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error in getRestaurantById:', err);
    // Return mock data if an error occurs
    return getMockRestaurantById(id);
  }
};

// Mock function to provide fallback restaurant data
const getMockRestaurantById = (id: string) => {
  console.log('Using mock data for restaurant ID:', id);
  return {
    id,
    name: "Sample Restaurant",
    cuisine: "International",
    location: "City Center",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    occupied_seats: 45,
    total_seats: 100,
    estimated_wait_time: 15,
    phone_number: "(555) 123-4567"
  };
};

// Generate hourly occupancy data for charts
export const getOccupancyData = async (restaurantId: string) => {
  try {
    // First, get the restaurant to know total seats
    const restaurant = await getRestaurantById(restaurantId);
    if (!restaurant) return [];
    
    const totalSeats = restaurant.total_seats || 100; // Fallback to 100 if not available
    
    const currentHour = new Date().getHours();
    const data = [];
    
    // Create 12 hours of data (past and future)
    for (let i = -6; i <= 6; i++) {
      const hour = (currentHour + i) % 24;
      const displayHour = hour < 0 ? 24 + hour : hour;
      
      // Generate realistic occupancy patterns
      let occupancyPercentage;
      
      if (displayHour >= 11 && displayHour <= 14) {
        // Lunch peak hours
        occupancyPercentage = Math.floor(Math.random() * 30) + 60; // 60-90%
      } else if (displayHour >= 18 && displayHour <= 21) {
        // Dinner peak hours
        occupancyPercentage = Math.floor(Math.random() * 35) + 65; // 65-100%
      } else if (displayHour >= 22 || displayHour <= 6) {
        // Late night/early morning (closed or very empty)
        occupancyPercentage = Math.floor(Math.random() * 15); // 0-15%
      } else {
        // Regular hours
        occupancyPercentage = Math.floor(Math.random() * 40) + 20; // 20-60%
      }
      
      // Calculate seats based on percentage
      const occupiedSeats = Math.floor((totalSeats * occupancyPercentage) / 100);
      
      data.push({
        hour: `${displayHour}:00`,
        occupiedSeats,
        availableSeats: totalSeats - occupiedSeats,
        totalSeats,
        occupancy: occupancyPercentage,
      });
    }
    
    return data;
  } catch (err) {
    console.error('Error generating occupancy data:', err);
    return []; // Return empty array to prevent app from crashing
  }
};

// Get user's bookmarked restaurants
export const getBookmarkedRestaurants = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('restaurant_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
    
    if (!data || data.length === 0) return [];
    
    const restaurantIds = data.map(bookmark => bookmark.restaurant_id);
    
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('*')
      .in('id', restaurantIds);
    
    if (restaurantsError) {
      console.error('Error fetching bookmarked restaurants:', restaurantsError);
      return [];
    }
    
    return restaurants || [];
  } catch (err) {
    console.error('Unexpected error in getBookmarkedRestaurants:', err);
    return [];
  }
};
