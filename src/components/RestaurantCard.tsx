
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Star } from 'lucide-react';
import type { Restaurant } from '@/store/restaurantData';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const occupancyPercentage = Math.round((restaurant.occupiedSeats / restaurant.totalSeats) * 100);
  
  // Determine the color of the progress bar based on occupancy
  const getProgressColor = () => {
    if (occupancyPercentage >= 80) return 'bg-red-500';
    if (occupancyPercentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
          <span className="text-sm font-medium">{restaurant.rating}</span>
        </div>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
        
        <div className="flex items-center mb-2 text-sm">
          <MapPin className="w-4 h-4 mr-1 text-gray-500" />
          <span className="text-gray-600">{restaurant.location}</span>
        </div>
        
        <div className="flex items-center mb-4 text-sm">
          <Clock className="w-4 h-4 mr-1 text-gray-500" />
          <span className="text-gray-600">{restaurant.estimatedWaitTime} min wait</span>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Current occupancy</span>
            <span className="font-medium">{restaurant.occupiedSeats} / {restaurant.totalSeats} seats</span>
          </div>
          <Progress value={occupancyPercentage} className={`h-2 ${getProgressColor()}`} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Link to={`/restaurants/${restaurant.id}`} className="w-full">
          <Button className="w-full" variant="outline">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;
