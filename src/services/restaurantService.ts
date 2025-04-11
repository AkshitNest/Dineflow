
import { supabase } from '@/lib/supabase';

// Get all restaurants
export const getAllRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*');
  
  if (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
  
  return data;
};

// Get restaurant by ID
export const getRestaurantById = async (id: string) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
  
  return data;
};

// Generate hourly occupancy data for charts
export const getOccupancyData = async (restaurantId: string) => {
  // First, get the restaurant to know total seats
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) return [];
  
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
    const occupiedSeats = Math.floor((restaurant.total_seats * occupancyPercentage) / 100);
    
    data.push({
      hour: `${displayHour}:00`,
      occupiedSeats,
      availableSeats: restaurant.total_seats - occupiedSeats,
      totalSeats: restaurant.total_seats,
      occupancy: occupancyPercentage,
    });
  }
  
  return data;
};

// Get user's bookmarked restaurants
export const getBookmarkedRestaurants = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('restaurant_id')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
  
  if (!data || data.length === 0) return [];
  
  const restaurantIds = data.map(bookmark => bookmark.restaurant_id);
  
  const { data: restaurants, error: restaurantsError } = await supabase
    .from('restaurants')
    .select('*')
    .in('id', restaurantIds);
  
  if (restaurantsError) {
    console.error('Error fetching bookmarked restaurants:', restaurantsError);
    throw restaurantsError;
  }
  
  return restaurants;
};
