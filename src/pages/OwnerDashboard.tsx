
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/store/authContext';
import { CalendarCheck2, Clock, Users, Utensils, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  
  const occupancyPercentage = Math.round((restaurantData.occupiedSeats / restaurantData.totalSeats) * 100);
  
  // Determine the color of the progress bar based on occupancy
  const getProgressColor = () => {
    if (occupancyPercentage >= 80) return 'bg-red-500';
    if (occupancyPercentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
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
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Manage reservations for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Customer</th>
                        <th className="py-3 px-4 text-left">Time</th>
                        <th className="py-3 px-4 text-left">Party Size</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantData.upcomingReservations.map((reservation) => (
                        <tr key={reservation.id} className="border-b">
                          <td className="py-3 px-4">{reservation.customer}</td>
                          <td className="py-3 px-4">{reservation.time}</td>
                          <td className="py-3 px-4">{reservation.guests} guests</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                reservation.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle>Table Management</CardTitle>
                <CardDescription>Manage your restaurant layout and table assignments</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">
                  Table management functionality coming soon...
                </p>
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
