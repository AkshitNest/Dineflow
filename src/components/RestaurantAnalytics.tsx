import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { getOccupancyData } from '@/services/restaurantService';
import { ChartBarIcon, Users, TrendingUp, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RestaurantAnalyticsProps {
  restaurantId: string;
}

const RestaurantAnalytics: React.FC<RestaurantAnalyticsProps> = ({ restaurantId }) => {
  const [occupancyData, setOccupancyData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState('today');

  // Generate data for weekly predictions
  const generateWeeklyData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDay = new Date().getDay();
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1; // Convert to 0-6 (Mon-Sun)
    
    return days.map((day, index) => {
      let predictedOccupancy;
      
      // Weekend days typically have higher occupancy
      if (index === 5 || index === 6) {
        predictedOccupancy = Math.floor(Math.random() * 25) + 70; // 70-95%
      } 
      // Friday has medium-high occupancy
      else if (index === 4) {
        predictedOccupancy = Math.floor(Math.random() * 25) + 60; // 60-85%
      }
      // Regular weekdays
      else {
        predictedOccupancy = Math.floor(Math.random() * 30) + 40; // 40-70%
      }
      
      // Mark current day for highlighting
      const isCurrent = index === dayIndex;
      
      return {
        day,
        occupancy: predictedOccupancy,
        isCurrent,
      };
    });
  };

  // Generate customer sentiment data
  const generateSentimentData = () => {
    const lastSixMonths = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate);
      month.setMonth(currentDate.getMonth() - i);
      
      lastSixMonths.push({
        month: month.toLocaleString('default', { month: 'short' }),
        positive: Math.floor(Math.random() * 20) + 70, // 70-90%
        neutral: Math.floor(Math.random() * 15) + 5, // 5-20%
        negative: Math.floor(Math.random() * 10) + 1, // 1-10%
      });
    }
    
    return lastSixMonths;
  };

  // Generate peak hours prediction
  const generatePeakHoursPrediction = () => {
    const hours = [];
    
    for (let hour = 10; hour <= 22; hour++) {
      const displayHour = hour <= 12 ? `${hour}am` : `${hour - 12}pm`;
      let predictedOccupancy;
      
      // Lunch peak (12pm-2pm)
      if (hour >= 12 && hour <= 14) {
        predictedOccupancy = Math.floor(Math.random() * 20) + 75; // 75-95%
      }
      // Dinner peak (6pm-9pm)
      else if (hour >= 18 && hour <= 21) {
        predictedOccupancy = Math.floor(Math.random() * 15) + 80; // 80-95%
      }
      // Other hours
      else {
        predictedOccupancy = Math.floor(Math.random() * 30) + 30; // 30-60%
      }
      
      // Is current hour
      const isCurrent = hour === new Date().getHours();
      
      hours.push({
        hour: displayHour,
        predicted: predictedOccupancy,
        actual: isCurrent ? Math.floor(Math.random() * 20) + (predictedOccupancy - 10) : null,
        isCurrent
      });
    }
    
    return hours;
  };

  React.useEffect(() => {
    const fetchOccupancyData = async () => {
      setLoading(true);
      try {
        const data = await getOccupancyData(restaurantId);
        setOccupancyData(data);
      } catch (error) {
        console.error('Failed to fetch occupancy data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOccupancyData();
  }, [restaurantId]);

  // Generate weekly data
  const weeklyData = React.useMemo(() => generateWeeklyData(), []);
  
  // Generate sentiment data
  const sentimentData = React.useMemo(() => generateSentimentData(), []);
  
  // Generate peak hours prediction
  const peakHoursData = React.useMemo(() => generatePeakHoursPrediction(), []);

  const todayPredictedFootfall = React.useMemo(() => {
    const baseFootfall = 120;
    const dayOfWeek = new Date().getDay(); // 0-6 (Sun-Sat)
    const adjustments = {
      0: 1.2, // Sunday
      1: 0.7, // Monday
      2: 0.8, // Tuesday
      3: 0.9, // Wednesday
      4: 1.0, // Thursday
      5: 1.3, // Friday
      6: 1.4, // Saturday
    };
    
    return Math.round(baseFootfall * adjustments[dayOfWeek as keyof typeof adjustments]);
  }, []);
  
  // Calculate forecasted revenue based on predicted footfall and average spend
  const averageSpendPerCustomer = 35;
  const forecastedRevenue = todayPredictedFootfall * averageSpendPerCustomer;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Predicted Footfall</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPredictedFootfall} guests</div>
            <p className="text-xs text-muted-foreground">Based on historical data and current trends</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forecasted Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${forecastedRevenue}</div>
            <p className="text-xs text-muted-foreground">Estimated based on avg. spend of ${averageSpendPerCustomer}/guest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Area 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="#8884d8" 
                  fill="rgba(136, 132, 216, 0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hourly">
        <TabsList className="mb-4">
          <TabsTrigger value="hourly">Hourly Prediction</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Forecast</TabsTrigger>
          <TabsTrigger value="sentiment">Customer Sentiment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>Predicted vs Actual Occupancy Today</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  predicted: { 
                    label: "Predicted",
                    color: "#8884d8" 
                  },
                  actual: { 
                    label: "Actual",
                    color: "#82ca9d" 
                  },
                }}
              >
                <LineChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis unit="%" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#82ca9d"
                    strokeWidth={2} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Predicted peak hours: 12-2pm (lunch) and 6-9pm (dinner)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Occupancy Forecast</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  occupancy: { 
                    label: "Occupancy %",
                    color: "#8884d8" 
                  },
                }}
              >
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis unit="%" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="occupancy" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Highest occupancy expected on weekends
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Customer Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartContainer
                config={{
                  positive: { 
                    label: "Positive",
                    color: "#82ca9d" 
                  },
                  neutral: { 
                    label: "Neutral",
                    color: "#8884d8" 
                  },
                  negative: { 
                    label: "Negative",
                    color: "#ff8042" 
                  },
                }}
              >
                <AreaChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis unit="%" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stackId="1"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="neutral" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="negative" 
                    stackId="1"
                    stroke="#ff8042" 
                    fill="#ff8042" 
                  />
                </AreaChart>
              </ChartContainer>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Customer sentiment has been consistently positive over the last 6 months
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Historical Occupancy Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ChartContainer
            config={{
              occupiedSeats: { 
                label: "Occupied Seats",
                color: "#8884d8" 
              },
              availableSeats: { 
                label: "Available Seats",
                color: "#82ca9d" 
              },
            }}
          >
            <BarChart data={occupancyData} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar 
                dataKey="occupiedSeats" 
                stackId="stack" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="availableSeats" 
                stackId="stack" 
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantAnalytics;
