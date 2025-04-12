
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/store/authContext';
import { getReservationsWithRestaurantDetails, updateReservationStatus } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Users, X, Table, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import TableNotification from '@/components/TableNotification';
import {
  Table as UITable,
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
        
        // Show notification for confirmed bookings
        const recentConfirmed = data.find(res => 
          res.status === 'confirmed' && 
          !res.notificationShown &&
          new Date(res.date + 'T' + res.time) > new Date()
        );
        
        if (recentConfirmed) {
          toast({
            title: "Booking Confirmed!",
            description: recentConfirmed.table_number 
              ? `Your table (${recentConfirmed.table_number}) has been confirmed.` 
              : "Your reservation has been confirmed.",
            variant: "default"
          });
          
          // Mark as notification shown (in a real app, would store this state in the database)
          setReservations(prev => prev.map(res => 
            res.id === recentConfirmed.id ? {...res, notificationShown: true} : res
          ));
        }
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
    
    // Set up interval to refresh reservations every minute for real-time updates
    const intervalId = setInterval(fetchReservations, 60000);
    
    return () => clearInterval(intervalId);
  }, [user, toast]);
  
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
      case 'queued':
        return 'bg-blue-100 text-blue-800';
      case 'seated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderStatusInfo = (reservation: any) => {
    if (reservation.status === 'confirmed' && reservation.table_number) {
      return (
        <div className="bg-green-50 p-3 rounded-md flex items-center">
          <Table className="h-4 w-4 mr-2 text-green-600" />
          <span className="font-medium">Table {reservation.table_number} confirmed!</span>
        </div>
      );
    } else if (reservation.status === 'pending') {
      return (
        <div className="bg-yellow-50 p-3 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
          <span>Your reservation is awaiting confirmation</span>
        </div>
      );
    } else if (reservation.status === 'queued') {
      return (
        <div className="bg-blue-50 p-3 rounded-md">
          <TableNotification 
            reservationId={reservation.id} 
            queuePosition={reservation.queue_position} 
            tableNumber={reservation.table_number}
            status={reservation.status}
          />
        </div>
      );
    }
    return null;
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
                            src={reservation.restaurant?.image || '/placeholder.svg'} 
                            alt={reservation.restaurant?.name || 'Restaurant'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{reservation.restaurant?.name || 'Restaurant Name'}</CardTitle>
                              <CardDescription>
                                <div className="flex items-center mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{reservation.restaurant?.location || 'Location'}</span>
                                </div>
                              </CardDescription>
                            </div>
                            <Badge className={getStatusBadgeStyle(reservation.status)}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 mb-4">
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
                              <span>{reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{reservation.table_type} table</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            {renderStatusInfo(reservation)}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Reservation
                          </Button>
                        </CardContent>
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
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Restaurant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Party Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Table</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedReservations.map(reservation => (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">{reservation.restaurant?.name || 'Restaurant'}</TableCell>
                            <TableCell>{formatDisplayDate(reservation.date)}</TableCell>
                            <TableCell>{reservation.time}</TableCell>
                            <TableCell>{reservation.party_size} people</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeStyle(reservation.status)}>
                                {reservation.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{reservation.table_number || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
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
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Restaurant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Party Size</TableHead>
                          <TableHead>Cancelled On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations
                          .filter(r => r.status === 'cancelled')
                          .map(reservation => (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-medium">{reservation.restaurant?.name || 'Restaurant'}</TableCell>
                              <TableCell>{formatDisplayDate(reservation.date)}</TableCell>
                              <TableCell>{reservation.time}</TableCell>
                              <TableCell>{reservation.party_size} people</TableCell>
                              <TableCell>{formatDisplayDate(reservation.updated_at || reservation.created_at)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </UITable>
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
