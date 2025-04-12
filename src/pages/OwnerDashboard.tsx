
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/store/authContext';
import { CalendarCheck2, Clock, Users, Utensils, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserReservations } from '@/services/reservationService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from '@/hooks/use-toast';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for restaurant owner dashboard
  const restaurantData = {
    name: "Bella Italia",
    todayReservations: 42,
    totalSeats: 120,
    occupiedSeats: 86,
    upcomingReservations: [
      { id: 1, customer: "John Smith", time: "19:00", guests: 4, status: "confirmed" },
      { id: 2, customer: "Alice Johnson", time: "19:30", guests: 2, status: "confirmed" },
      { id: 3, customer: "Robert Brown", time: "20:00", guests: 6, status: "pending" },
      { id: 4, customer: "Emily Davis", time: "20:30", guests: 3, status: "confirmed" },
    ],
    stats: {
      dailyIncome: 3245,
      weeklyChange: 8.5,
      averageOccupancy: 72,
      averageVisitTime: 96,
    }
  };
  
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // In a real app, you would fetch the reservations for the restaurant owned by this user
        // For now, we'll use the getUserReservations function to get some data
        const data = await getUserReservations(user.id);
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reservations',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [user]);
  
  const occupancyPercentage = Math.round((restaurantData.occupiedSeats / restaurantData.totalSeats) * 100);
  
  // Determine the color of the progress bar based on occupancy
  const getProgressColor = () => {
    if (occupancyPercentage >= 80) return 'bg-red-500';
    if (occupancyPercentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  // Filter and sort reservations for different views
  const upcomingReservations = reservations
    .filter(res => res.status !== 'cancelled')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 10); // Show only the first 10

  const cancelledReservations = reservations
    .filter(res => res.status === 'cancelled')
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime())
    .slice(0, 10); // Show only the first 10
  
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
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Restaurant Owner'}</h1>
            <p className="text-muted-foreground">Here's an overview of {restaurantData.name}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate('/owner-dashboard/add-restaurant')}>
              Add New Restaurant
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Reservations</CardTitle>
              <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurantData.todayReservations}</div>
              <p className="text-xs text-muted-foreground">Bookings for today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurantData.occupiedSeats} / {restaurantData.totalSeats}</div>
              <div className="mt-2">
                <Progress value={occupancyPercentage} className={`h-2 ${getProgressColor()}`} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${restaurantData.stats.dailyIncome}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={restaurantData.stats.weeklyChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {restaurantData.stats.weeklyChange >= 0 ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
                  {Math.abs(restaurantData.stats.weeklyChange)}%
                </span>
                <span className="ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Visit Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurantData.stats.averageVisitTime} min</div>
              <p className="text-xs text-muted-foreground">Average dining duration</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Reservations</TabsTrigger>
            <TabsTrigger value="tables">Table Management</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled Reservations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Manage reservations for today</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : upcomingReservations.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left">Customer</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Time</th>
                          <th className="py-3 px-4 text-left">Party Size</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Table</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingReservations.map((reservation) => (
                          <tr key={reservation.id} className="border-b">
                            <td className="py-3 px-4">{user?.name || 'Customer Name'}</td>
                            <td className="py-3 px-4">{formatDate(reservation.date)}</td>
                            <td className="py-3 px-4">{reservation.time}</td>
                            <td className="py-3 px-4">{reservation.party_size} guests</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusBadgeStyle(reservation.status)}>
                                {reservation.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{reservation.table_number || 'Not assigned'}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming reservations found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle>Table Management</CardTitle>
                <CardDescription>Manage your restaurant layout and table assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Current Table Allocations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingReservations
                          .filter(res => res.status === 'confirmed' && res.table_number)
                          .map(reservation => (
                            <Card key={reservation.id} className="bg-green-50 border-green-200">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold">Table {reservation.table_number}</span>
                                  <Badge className="bg-green-100 text-green-800">Occupied</Badge>
                                </div>
                                <div className="text-sm space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer:</span> 
                                    <span>{user?.name || 'Customer Name'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time:</span> 
                                    <span>{reservation.time}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Party Size:</span> 
                                    <span>{reservation.party_size} guests</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        
                        {/* Display some empty tables */}
                        {[1, 2, 3, 4].map(num => (
                          <Card key={`empty-${num}`} className="bg-gray-50 border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold">Table T{num + 20}</span>
                                <Badge className="bg-gray-100 text-gray-800">Available</Badge>
                              </div>
                              <div className="text-sm">
                                <p className="text-muted-foreground">Ready for seating</p>
                                <p className="text-muted-foreground">Capacity: 4 guests</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Queue Management</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Party Size</TableHead>
                            <TableHead>Queue Position</TableHead>
                            <TableHead>Waiting Since</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingReservations
                            .filter(res => res.status === 'queued')
                            .map(reservation => (
                              <TableRow key={reservation.id}>
                                <TableCell className="font-medium">{user?.name || 'Customer Name'}</TableCell>
                                <TableCell>{reservation.party_size} guests</TableCell>
                                <TableCell>#{reservation.queue_position || '?'}</TableCell>
                                <TableCell>{reservation.time}</TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline" className="mr-2">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Assign Table
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            
                          {upcomingReservations.filter(res => res.status === 'queued').length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                No customers currently in queue
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Reservations</CardTitle>
                <CardDescription>Review cancelled bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : cancelledReservations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Party Size</TableHead>
                        <TableHead>Table Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cancelledReservations.map(reservation => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">{user?.name || 'Customer Name'}</TableCell>
                          <TableCell>{formatDate(reservation.date)}</TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell>{reservation.party_size} guests</TableCell>
                          <TableCell>{reservation.table_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No cancelled reservations found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">
                  Analytics tools coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
