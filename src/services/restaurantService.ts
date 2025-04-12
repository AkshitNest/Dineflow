import { getSupabaseClient } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Get all restaurants
export const getAllRestaurants = async () => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*');
    
    if (error) {
      console.error('Error fetching restaurants:', error);
      toast({
        title: "Error fetching restaurants",
        description: "Could not connect to database. Using sample data instead.",
        variant: "destructive",
      });
      // Return dummy data from restaurantData.ts if Supabase fails
      return getMockRestaurants();
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getAllRestaurants:', err);
    return getMockRestaurants(); // Return dummy data
  }
};

// Get restaurant by ID
export const getRestaurantById = async (id: string) => {
  try {
    console.log('Fetching restaurant with ID:', id);
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching restaurant:', error);
      toast({
        title: "Using sample data",
        description: "Could not connect to database. Displaying sample restaurant data instead.",
        variant: "default",
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

// Get mock restaurants for fallback
const getMockRestaurants = () => {
  // Import from store/restaurantData if needed
  return [
    {
      id: '1',
      name: "Bistro Nouveau",
      cuisine: "French",
      location: "New York",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
      occupied_seats: 32,
      total_seats: 50,
      estimated_wait_time: 25,
      phone_number: "(212) 555-1234"
    },
    {
      id: '2',
      name: "Sakura Sushi",
      cuisine: "Japanese",
      location: "San Francisco",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      occupied_seats: 34,
      total_seats: 40,
      estimated_wait_time: 40,
      phone_number: "(415) 555-6789"
    },
    {
      id: '3',
      name: "Trattoria Milano",
      cuisine: "Italian",
      location: "Chicago",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
      occupied_seats: 28,
      total_seats: 60,
      estimated_wait_time: 15,
      phone_number: "(312) 555-2345"
    }
  ];
};

// Mock function to provide fallback restaurant data
const getMockRestaurantById = (id: string) => {
  console.log('Using mock data for restaurant ID:', id);
  
  const mockRestaurants = {
    '1': {
      id: '1',
      name: "Bistro Nouveau",
      cuisine: "French",
      location: "New York",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
      occupied_seats: 32,
      total_seats: 50,
      estimated_wait_time: 25,
      phone_number: "(212) 555-1234"
    },
    '2': {
      id: '2',
      name: "Sakura Sushi",
      cuisine: "Japanese",
      location: "San Francisco",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      occupied_seats: 34,
      total_seats: 40,
      estimated_wait_time: 40,
      phone_number: "(415) 555-6789"
    },
    '3': {
      id: '3',
      name: "Trattoria Milano",
      cuisine: "Italian",
      location: "Chicago",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
      occupied_seats: 28,
      total_seats: 60,
      estimated_wait_time: 15,
      phone_number: "(312) 555-2345"
    }
  };
  
  return mockRestaurants[id as keyof typeof mockRestaurants] || {
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
      
      // Add day of week factor - weekends are typically busier
      const dayOfWeek = new Date().getDay();
      let dayFactor = 1.0;
      
      // Weekend adjustment
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        dayFactor = 1.2;
      } else if (dayOfWeek === 5) { // Friday
        dayFactor = 1.15;
      } else if (dayOfWeek === 1) { // Monday
        dayFactor = 0.85;
      }
      
      // Apply day factor
      const adjustedOccupiedSeats = Math.min(
        Math.round(occupiedSeats * dayFactor),
        totalSeats
      );
      
      data.push({
        hour: `${displayHour}:00`,
        occupiedSeats: adjustedOccupiedSeats,
        availableSeats: totalSeats - adjustedOccupiedSeats,
        totalSeats,
        occupancy: Math.round((adjustedOccupiedSeats / totalSeats) * 100),
      });
    }
    
    return data;
  } catch (err) {
    console.error('Error generating occupancy data:', err);
    return []; // Return empty array to prevent app from crashing
  }
};

// Get customer demographics for analytics
export const getCustomerDemographics = async (restaurantId: string) => {
  // This would normally fetch from a database, but we'll generate mock data for now
  return {
    ageGroups: [
      { name: '18-24', value: 15 },
      { name: '25-34', value: 30 },
      { name: '35-44', value: 25 },
      { name: '45-54', value: 15 },
      { name: '55+', value: 15 },
    ],
    visitFrequency: [
      { name: 'First Time', value: 20 },
      { name: 'Occasional', value: 35 },
      { name: 'Regular', value: 30 },
      { name: 'Frequent', value: 15 },
    ],
    reservationSource: [
      { name: 'Direct', value: 40 },
      { name: 'App', value: 30 },
      { name: 'Phone', value: 15 },
      { name: 'Partners', value: 15 },
    ]
  };
};

// Predict footfall for a given date
export const predictFootfall = async (restaurantId: string, date: Date = new Date()) => {
  try {
    // This would use ML models in a real app, but we'll simulate a prediction
    const dayOfWeek = date.getDay(); // 0-6, 0 is Sunday
    const month = date.getMonth(); // 0-11
    const isHoliday = false; // This would check against a holiday database
    
    // Base footfall values by day of week
    const baseFootfall = {
      0: 110, // Sunday
      1: 75,  // Monday
      2: 80,  // Tuesday
      3: 85,  // Wednesday
      4: 95,  // Thursday
      5: 130, // Friday
      6: 140  // Saturday
    };
    
    // Seasonal adjustments (simplified)
    const seasonalFactor = [0.9, 0.9, 1.0, 1.05, 1.1, 1.15, 1.2, 1.2, 1.1, 1.0, 0.95, 1.1][month];
    
    // Holiday adjustment
    const holidayFactor = isHoliday ? 1.3 : 1.0;
    
    // Weather factor (simulated - would use weather API in real app)
    const weatherFactor = 1.0;
    
    // Calculate prediction
    const prediction = Math.round(
      baseFootfall[dayOfWeek as keyof typeof baseFootfall] * 
      seasonalFactor * 
      holidayFactor * 
      weatherFactor
    );
    
    return {
      prediction,
      factors: {
        dayOfWeek,
        seasonalFactor,
        holidayFactor,
        weatherFactor
      }
    };
  } catch (err) {
    console.error('Error predicting footfall:', err);
    return { prediction: 100, factors: {} }; // Default fallback
  }
};

// Get user's bookmarked restaurants
export const getBookmarkedRestaurants = async (userId: string) => {
  try {
    const supabase = getSupabaseClient();
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
