
// Dummy restaurant data for our application

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  address: string;
  location: string;
  totalSeats: number;
  occupiedSeats: number;
  rating: number;
  estimatedWaitTime: number; // in minutes
  priceRange: string;
  description: string;
  hours: string;
  phoneNumber: string;
  website?: string;
}

// List of restaurants with current occupancy data
export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bistro Nouveau',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
    cuisine: 'French',
    address: '123 Main St, New York, NY 10001',
    location: 'New York',
    totalSeats: 50,
    occupiedSeats: 32,
    rating: 4.7,
    estimatedWaitTime: 25,
    priceRange: '$$$',
    description: 'An elegant French bistro offering classic dishes with a modern twist. Our sommelier has curated an exceptional wine list to complement your dining experience.',
    hours: 'Mon-Sun: 11:00 AM - 10:00 PM',
    phoneNumber: '(212) 555-1234',
    website: 'https://bistronouveau.example.com',
  },
  {
    id: '2',
    name: 'Sakura Sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop',
    cuisine: 'Japanese',
    address: '456 Oak Ave, San Francisco, CA 94103',
    location: 'San Francisco',
    totalSeats: 40,
    occupiedSeats: 34,
    rating: 4.8,
    estimatedWaitTime: 40,
    priceRange: '$$',
    description: 'Authentic Japanese sushi restaurant featuring the freshest fish flown in daily from Tokyo\'s Tsukiji market. Our master chefs create edible art with each plate.',
    hours: 'Tue-Sun: 12:00 PM - 9:30 PM, Closed Mondays',
    phoneNumber: '(415) 555-6789',
  },
  {
    id: '3',
    name: 'Trattoria Milano',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
    cuisine: 'Italian',
    address: '789 Pine Blvd, Chicago, IL 60611',
    location: 'Chicago',
    totalSeats: 60,
    occupiedSeats: 28,
    rating: 4.5,
    estimatedWaitTime: 15,
    priceRange: '$$',
    description: 'Family-owned Italian restaurant serving homemade pasta and wood-fired pizza. Our recipes have been passed down through generations, bringing the authentic taste of Milan to Chicago.',
    hours: 'Mon-Sun: 11:30 AM - 11:00 PM',
    phoneNumber: '(312) 555-2345',
    website: 'https://milanochicago.example.com',
  },
  {
    id: '4',
    name: 'El Mariachi',
    image: 'https://images.unsplash.com/photo-1653495802730-551aa22561d7?w=800&auto=format&fit=crop',
    cuisine: 'Mexican',
    address: '101 Cedar St, Austin, TX 78701',
    location: 'Austin',
    totalSeats: 45,
    occupiedSeats: 20,
    rating: 4.6,
    estimatedWaitTime: 10,
    priceRange: '$$',
    description: 'Vibrant Mexican cantina known for its street tacos and extensive tequila selection. Live mariachi band performs every Friday and Saturday night.',
    hours: 'Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 1:00 AM, Sun: 12:00 PM - 9:00 PM',
    phoneNumber: '(512) 555-3456',
  },
  {
    id: '5',
    name: 'Dragon Palace',
    image: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=800&auto=format&fit=crop',
    cuisine: 'Chinese',
    address: '202 Maple Rd, Seattle, WA 98101',
    location: 'Seattle',
    totalSeats: 80,
    occupiedSeats: 65,
    rating: 4.3,
    estimatedWaitTime: 35,
    priceRange: '$$',
    description: 'Upscale Chinese restaurant specializing in authentic Sichuan cuisine. Our chefs use traditional techniques and imported spices to create bold, flavorful dishes.',
    hours: 'Mon-Sun: 12:00 PM - 10:30 PM',
    phoneNumber: '(206) 555-4567',
    website: 'https://dragonpalace.example.com',
  },
  {
    id: '6',
    name: 'Mediterranean Garden',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop',
    cuisine: 'Greek',
    address: '303 Beach Dr, Miami, FL 33139',
    location: 'Miami',
    totalSeats: 55,
    occupiedSeats: 30,
    rating: 4.4,
    estimatedWaitTime: 20,
    priceRange: '$$',
    description: 'Seaside Mediterranean restaurant offering fresh seafood and Greek specialties. Enjoy your meal on our terrace overlooking the beach with stunning ocean views.',
    hours: 'Mon-Sun: 11:00 AM - 11:00 PM',
    phoneNumber: '(305) 555-5678',
  },
  {
    id: '7',
    name: 'The Steakhouse',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop',
    cuisine: 'American',
    address: '404 Hill St, Dallas, TX 75201',
    location: 'Dallas',
    totalSeats: 70,
    occupiedSeats: 58,
    rating: 4.9,
    estimatedWaitTime: 45,
    priceRange: '$$$$',
    description: 'Premium steakhouse serving aged USDA Prime beef and fresh seafood. Our open kitchen allows guests to watch our chefs prepare their meals over an open flame grill.',
    hours: 'Mon-Thu: 5:00 PM - 10:00 PM, Fri-Sat: 5:00 PM - 11:00 PM, Sun: 4:00 PM - 9:00 PM',
    phoneNumber: '(214) 555-6789',
    website: 'https://thesteakhouse.example.com',
  },
  {
    id: '8',
    name: 'Taj Mahal',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
    cuisine: 'Indian',
    address: '505 River Ave, Boston, MA 02108',
    location: 'Boston',
    totalSeats: 45,
    occupiedSeats: 25,
    rating: 4.6,
    estimatedWaitTime: 15,
    priceRange: '$$',
    description: 'Authentic Indian cuisine featuring tandoori specialties and flavorful curries. Our chefs use traditional methods and freshly ground spices for an authentic taste of India.',
    hours: 'Tue-Sun: 11:30 AM - 10:00 PM, Closed Mondays',
    phoneNumber: '(617) 555-7890',
  },
];

// Function to get a restaurant by its ID
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

// Generate hourly occupancy data for charts (simulated data)
export const getOccupancyData = (restaurantId: string) => {
  // Get base data for the restaurant
  const restaurant = getRestaurantById(restaurantId);
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
    const occupiedSeats = Math.floor((restaurant.totalSeats * occupancyPercentage) / 100);
    
    data.push({
      hour: `${displayHour}:00`,
      occupiedSeats,
      availableSeats: restaurant.totalSeats - occupiedSeats,
      totalSeats: restaurant.totalSeats,
      occupancy: occupancyPercentage,
    });
  }
  
  return data;
};

// Create a list of user's bookmarked restaurants (for dashboard)
export const bookmarkedRestaurants = [
  restaurants[0],
  restaurants[2],
  restaurants[4],
];
