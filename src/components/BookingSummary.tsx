
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users } from 'lucide-react';

interface BookingSummaryProps {
  restaurantName: string;
  date: Date;
  time: string;
  party: number;
  tableType: string;
  isSubmitting?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  restaurantName,
  date,
  time,
  party,
  tableType,
  onConfirm,
  onCancel,
  isSubmitting = false
}) => {
  const { toast } = useToast();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleConfirm = () => {
    toast({
      title: "Booking confirmed!",
      description: `Your booking at ${restaurantName} has been confirmed.`
    });
    
    if (onConfirm) onConfirm();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
        <CardDescription>Review your reservation details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center border-b pb-4">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
          </div>
        </div>
        
        <div className="flex items-center border-b pb-4">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm text-muted-foreground">{time}</p>
          </div>
        </div>
        
        <div className="flex items-center border-b pb-4">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Party Size</p>
            <p className="text-sm text-muted-foreground">{party} {party === 1 ? 'person' : 'people'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <div className="h-5 w-5 text-primary flex items-center justify-center">
              <span className="text-xs font-bold">T</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Table Type</p>
            <p className="text-sm text-muted-foreground">{tableType}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;
