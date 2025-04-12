
import { getSupabaseClient } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Get all reservations for a user
export const getUserReservations = async (userId: string) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserReservations:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Get reservation by ID
export const getReservationById = async (id: string) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching reservation:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getReservationById:', error);
    return null;
  }
};

// Add a new reservation - with improved error handling and mock data fallback
export const addReservation = async (reservation: {
  restaurant_id: string;
  user_id: string;
  date: string;
  time: string;
  party_size: number;
  table_type: string;
  status?: string;
  queue_position?: number;
  table_number?: string;
}) => {
  try {
    console.log('Creating reservation with data:', reservation);
    
    const supabase = getSupabaseClient();
    
    // Check if direct table is available or queue needed
    const needsQueue = await checkIfQueueNeeded(reservation.restaurant_id, reservation.date, reservation.time, reservation.party_size);
    
    let reservationData = {
      ...reservation,
      status: needsQueue ? 'queued' : (reservation.status || 'confirmed'),
      queue_position: needsQueue ? await getNextQueuePosition(reservation.restaurant_id, reservation.date) : null,
      table_number: !needsQueue ? await allocateTable(reservation.restaurant_id, reservation.date, reservation.time, reservation.party_size) : null
    };
    
    // Try to insert the reservation with Supabase
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding reservation:', error);
      
      // For demo purposes, return a mock successful reservation
      console.log('Using mock reservation data since Supabase returned an error');
      
      // Simulate queue or direct table allocation for demo
      const mockNeedsQueue = Math.random() > 0.7; // 30% chance of being queued for demo
      const mockTableNumber = !mockNeedsQueue ? `T${Math.floor(Math.random() * 20) + 1}` : null;
      const mockQueuePosition = mockNeedsQueue ? Math.floor(Math.random() * 5) + 1 : null;
      
      return {
        id: `mock-${Date.now()}`,
        ...reservation,
        status: mockNeedsQueue ? 'queued' : 'confirmed',
        queue_position: mockQueuePosition,
        table_number: mockTableNumber,
        created_at: new Date().toISOString()
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    
    // For demo purposes, return a mock reservation if there's any error
    const mockNeedsQueue = Math.random() > 0.7; // 30% chance of being queued for demo
    const mockTableNumber = !mockNeedsQueue ? `T${Math.floor(Math.random() * 20) + 1}` : null;
    const mockQueuePosition = mockNeedsQueue ? Math.floor(Math.random() * 5) + 1 : null;
    
    return {
      id: `mock-${Date.now()}`,
      ...reservation,
      status: mockNeedsQueue ? 'queued' : 'confirmed',
      queue_position: mockQueuePosition,
      table_number: mockTableNumber,
      created_at: new Date().toISOString()
    };
  }
};

// Update reservation status
export const updateReservationStatus = async (id: string, status: 'confirmed' | 'pending' | 'cancelled' | 'queued' | 'seated') => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateReservationStatus:', error);
    // Return the original data with updated status for demo
    return { id, status };
  }
};

// Allocate table to a reservation - simulated function
export const allocateTable = async (restaurantId: string, date: string, time: string, partySize: number): Promise<string | null> => {
  try {
    // In a real implementation, this would check database for available tables
    // For demo purposes, we'll simulate a table allocation with a random table number
    const tableNumber = `T${Math.floor(Math.random() * 20) + 1}`;
    return tableNumber;
  } catch (error) {
    console.error('Error allocating table:', error);
    return null;
  }
};

// Check if queue is needed based on restaurant capacity
export const checkIfQueueNeeded = async (restaurantId: string, date: string, time: string, partySize: number): Promise<boolean> => {
  try {
    // In a real implementation, this would check restaurant capacity and existing bookings
    // For demo purposes, we'll use a random determination with 30% chance of needing queue
    return Math.random() > 0.7;
  } catch (error) {
    console.error('Error checking if queue needed:', error);
    return false;
  }
};

// Get next queue position for a restaurant on a specific date
export const getNextQueuePosition = async (restaurantId: string, date: string): Promise<number> => {
  try {
    // In a real implementation, this would query the highest queue position and add 1
    // For demo purposes, we'll use a random number between 1 and 5
    return Math.floor(Math.random() * 5) + 1;
  } catch (error) {
    console.error('Error getting next queue position:', error);
    return 1;
  }
};

// Notify user when table is available (in a real app, would use websockets or push notifications)
export const notifyTableAvailable = async (reservationId: string) => {
  try {
    // Update the reservation status to 'confirmed' and allocate a table
    const reservation = await getReservationById(reservationId);
    if (!reservation) return null;
    
    const tableNumber = await allocateTable(
      reservation.restaurant_id, 
      reservation.date, 
      reservation.time, 
      reservation.party_size
    );
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('reservations')
      .update({ 
        status: 'confirmed', 
        queue_position: null,
        table_number: tableNumber
      })
      .eq('id', reservationId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating reservation for table availability:', error);
      // For demo, return mock data
      return {
        id: reservationId,
        status: 'confirmed',
        queue_position: null,
        table_number: `T${Math.floor(Math.random() * 20) + 1}`
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in notifyTableAvailable:', error);
    // For demo purposes, return a mock result
    return {
      id: reservationId,
      status: 'confirmed',
      queue_position: null,
      table_number: `T${Math.floor(Math.random() * 20) + 1}`
    };
  }
};

// Get reservations with restaurant details
export const getReservationsWithRestaurantDetails = async (userId: string) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        restaurants:restaurant_id (*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching reservations with restaurant details:', error);
      throw error;
    }
    
    return data.map(reservation => ({
      ...reservation,
      restaurant: reservation.restaurants
    }));
  } catch (error) {
    console.error('Error in getReservationsWithRestaurantDetails:', error);
    // Return empty array to prevent UI crashes
    return [];
  }
};

// Simulate checking for table availability (for demo purposes)
// In a real app, this would be a websocket or server-sent event
export const checkForTableAvailability = (callback: (reservationId: string) => void) => {
  // For demo purposes, randomly trigger a notification after a short delay
  setTimeout(() => {
    // Generate a random reservation ID (in real app would be an actual ID)
    const mockReservationId = `mock-${Date.now()}`;
    callback(mockReservationId);
  }, 15000 + Math.random() * 30000); // Random time between 15-45 seconds
  
  return () => {}; // Cleanup function
};
