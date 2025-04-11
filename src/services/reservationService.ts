
import { supabase } from '@/lib/supabase';

// Get all reservations for a user
export const getUserReservations = async (userId: string) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
  
  return data;
};

// Get reservation by ID
export const getReservationById = async (id: string) => {
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
};

// Add a new reservation
export const addReservation = async (reservation: {
  restaurant_id: string;
  user_id: string;
  date: string;
  time: string;
  party_size: number;
  table_type: string;
  status?: string;
}) => {
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      ...reservation,
      status: reservation.status || 'confirmed'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding reservation:', error);
    throw error;
  }
  
  return data;
};

// Update reservation status
export const updateReservationStatus = async (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
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
};

// Get reservations with restaurant details
export const getReservationsWithRestaurantDetails = async (userId: string) => {
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
};
