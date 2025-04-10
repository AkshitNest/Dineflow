
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface OccupancyData {
  hour: string;
  occupiedSeats: number;
  availableSeats: number;
  totalSeats: number;
  occupancy: number;
}

interface OccupancyChartProps {
  data: OccupancyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-600">
          {`Occupied: ${data.occupiedSeats} seats (${data.occupancy}%)`}
        </p>
        <p className="text-sm text-gray-600">
          {`Available: ${data.availableSeats} seats`}
        </p>
      </div>
    );
  }
  return null;
};

const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  const currentHour = new Date().getHours() + ':00';
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="occupiedSeats" 
            stackId="1"
            stroke="#6d28d9" 
            fill="#6d28d9" 
            fillOpacity={0.6}
            name="Occupied Seats"
          />
          <Area 
            type="monotone" 
            dataKey="availableSeats"
            stackId="1" 
            stroke="#9b87f5" 
            fill="#9b87f5"
            fillOpacity={0.4}
            name="Available Seats"
          />
          {/* Reference line for current time */}
          {data.some(d => d.hour === currentHour) && (
            <CartesianGrid 
              verticalPoints={[data.findIndex(d => d.hour === currentHour)]}
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
