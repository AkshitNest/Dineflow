
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import BookingSummary from './BookingSummary';
import { useAuth } from '@/store/authContext';
import { addReservation } from '@/services/reservationService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BookingFormProps {
  restaurantId: string;
  restaurantName: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ restaurantId, restaurantName }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('19:00');
  const [party, setParty] = useState('2');
  const [tableType, setTableType] = useState('Standard');
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const availableTimeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];
  
  const tableTypes = ['Standard', 'Window', 'Booth', 'Bar', 'Outdoor'];
  
  const handleNext = () => {
    if (!user) {
      setError("You must be logged in to make a reservation");
      toast({
        title: "Authentication Required",
        description: "Please log in to make a reservation",
        variant: "destructive"
      });
      return;
    }
    
    setError(null);
    setStep(2);
  };
  
  const handleBack = () => {
    setError(null);
    setStep(1);
  };
  
  const handleConfirmBooking = async () => {
    if (!user || !date) {
      setError("You must be logged in and select a date to make a reservation");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log("Creating reservation with data:", {
        restaurant_id: restaurantId,
        user_id: user.id,
        date: format(date, 'yyyy-MM-dd'),
        time,
        party_size: parseInt(party),
        table_type: tableType,
      });
      
      // Create new reservation
      const newReservation = await addReservation({
        restaurant_id: restaurantId,
        user_id: user.id,
        date: format(date, 'yyyy-MM-dd'),
        time,
        party_size: parseInt(party),
        table_type: tableType,
      });
      
      if (newReservation) {
        console.log("Reservation created:", newReservation);
        
        // Show appropriate message based on whether reservation is queued or confirmed
        if (newReservation.status === 'queued') {
          toast({
            title: "Joined Waiting Queue",
            description: `You're #${newReservation.queue_position} in line. We'll notify you when your table is ready.`
          });
        } else {
          toast({
            title: "Booking Confirmed!",
            description: newReservation.table_number
              ? `Your reservation at ${restaurantName} has been confirmed. Table ${newReservation.table_number} has been allocated.`
              : `Your reservation at ${restaurantName} has been confirmed.`
          });
        }
        
        // Navigate to reservations page
        navigate('/dashboard/reservations');
      } else {
        setError("Failed to create reservation. Please try again.");
        toast({
          title: "Booking Failed",
          description: "There was a problem creating your reservation. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError("There was an error creating your reservation. Please try again.");
      toast({
        title: "Booking Failed",
        description: "There was an error creating your reservation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (step === 2 && date) {
    return (
      <BookingSummary 
        restaurantName={restaurantName}
        date={date}
        time={time}
        party={parseInt(party)}
        tableType={tableType}
        onCancel={handleBack}
        onConfirm={handleConfirmBooking}
        isSubmitting={isSubmitting}
      />
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book a Table</CardTitle>
        <CardDescription>Make a reservation at {restaurantName}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!user && (
          <Alert className="mb-4">
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>You must be logged in to make a reservation</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="party">Party Size</Label>
            <Select value={party} onValueChange={setParty}>
              <SelectTrigger>
                <SelectValue placeholder="Select party size" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="table-type">Table Type</Label>
            <Select value={tableType} onValueChange={setTableType}>
              <SelectTrigger>
                <SelectValue placeholder="Select table type" />
              </SelectTrigger>
              <SelectContent>
                {tableTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <Input 
              id="phone" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests (Optional)</Label>
            <Input 
              id="special-requests" 
              value={specialRequests} 
              onChange={(e) => setSpecialRequests(e.target.value)} 
              placeholder="Any special requests or dietary requirements"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleNext}
          disabled={!user}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
