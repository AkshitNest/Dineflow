import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/store/authContext';
import { getReservationsWithRestaurantDetails, updateReservationStatus } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getReservationsWithRestaurantDetails(user.id);
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your reservations',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [user, toast]);
  
  // Filter reservations based on active tab
  const filteredReservations = reservations.filter(reservation => {
    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return reservationDate >= today && reservation.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return reservationDate < today && reservation.status !== 'cancelled';
    } else if (activeTab === 'cancelled') {
      return reservation.status === 'cancelled';
    }
    return true;
  });
  
  // Sort upcoming reservations by date (nearest first)
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return activeTab === 'upcoming' 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  });
  
  const handleCancelReservation = async (id: string) => {
    try {
      await updateReservationStatus(id, 'cancelled');
      
      // Update local state
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === id ? { ...res, status: 'cancelled' } : res
        )
      );
      
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled."
      });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">My Reservations</h1>
        <p className="text-muted-foreground mb-6">Manage your restaurant bookings</p>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {sortedReservations.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {sortedReservations.map(reservation => (
                    reservation.status !== 'cancelled' && (
                      <Card key={reservation.id} className="overflow-hidden">
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={reservation.restaurant?.image} 
                            alt={reservation.restaurant?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{reservation.restaurant?.name}</CardTitle>
                              <CardDescription>
                                <div className="flex items-center mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{reservation.restaurant?.location}</span>
                                </div>
                              </CardDescription>
                            </div>
                            <Badge className={getStatusBadgeStyle(reservation.status)}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDisplayDate(reservation.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{reservation.time}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{reservation.tableType} table</span>
                            </div>
                          </div>
                        </CardContent>
                        <div className="px-6 pb-6">
                          <Button 
                            variant="outline" 
                            className="w-full text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Reservation
                          </Button>
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground mb-4">You don't have any upcoming reservations.</p>
                    <Button onClick={() => window.location.href = '/dashboard/search'}>
                      Find Restaurants
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>Past Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  {sortedReservations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Restaurant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Party Size</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedReservations.map(reservation => (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">{reservation.restaurant?.name}</TableCell>
                            <TableCell>{formatDisplayDate(reservation.date)}</TableCell>
                            <TableCell>{reservation.time}</TableCell>
                            <TableCell>{reservation.partySize} people</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeStyle(reservation.status)}>
                                {reservation.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You don't have any past reservations.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cancelled">
              <Card>
                <CardHeader>
                  <CardTitle>Cancelled Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  {reservations.filter(r => r.status === 'cancelled').length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Restaurant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Party Size</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations
                          .filter(r => r.status === 'cancelled')
                          .map(reservation => (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-medium">{reservation.restaurant?.name}</TableCell>
                              <TableCell>{formatDisplayDate(reservation.date)}</TableCell>
                              <TableCell>{reservation.time}</TableCell>
                              <TableCell>{reservation.partySize} people</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You don't have any cancelled reservations.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReservationsPage;
