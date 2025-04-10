
import { restaurants } from './restaurantData';

export interface Reservation {
  id: string;
  restaurantId: string;
  userId: string;
  date: string;
  time: string;
  partySize: number;
  tableType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

// Mock database for reservations
let reservations: Reservation[] = [
  {
    id: '1',
    restaurantId: '1',
    userId: 'user1',
    date: '2025-04-15',
    time: '19:00',
    partySize: 2,
    tableType: 'Window',
    status: 'confirmed',
    createdAt: '2025-04-10T10:30:00Z',
  },
  {
    id: '2',
    restaurantId: '3',
    userId: 'user1',
    date: '2025-04-20',
    time: '20:30',
    partySize: 4,
    tableType: 'Booth',
    status: 'confirmed',
    createdAt: '2025-04-10T11:45:00Z',
  }
];

// Function to get all reservations for a user
export const getUserReservations = (userId: string): Reservation[] => {
  return reservations
    .filter(reservation => reservation.userId === userId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Function to add a new reservation
export const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
  const newReservation: Reservation = {
    ...reservation,
    id: `${reservations.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  
  reservations = [...reservations, newReservation];
  return newReservation;
};

// Function to get reservation by ID
export const getReservationById = (id: string): Reservation | undefined => {
  return reservations.find(reservation => reservation.id === id);
};

// Function to update reservation status
export const updateReservationStatus = (id: string, status: 'confirmed' | 'pending' | 'cancelled'): Reservation | undefined => {
  const index = reservations.findIndex(reservation => reservation.id === id);
  if (index === -1) return undefined;
  
  reservations[index] = {
    ...reservations[index],
    status
  };
  
  return reservations[index];
};

// Function to get reservation with restaurant details
export const getReservationWithRestaurantDetails = (userId: string) => {
  return getUserReservations(userId).map(reservation => {
    const restaurant = restaurants.find(r => r.id === reservation.restaurantId);
    return {
      ...reservation,
      restaurant: restaurant || null
    };
  });
};
