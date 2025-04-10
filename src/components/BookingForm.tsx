
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
  
  const availableTimeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];
  
  const tableTypes = ['Standard', 'Window', 'Booth', 'Bar', 'Outdoor'];
  
  const handleNext = () => {
    setStep(2);
  };
  
  const handleBack = () => {
    setStep(1);
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
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleNext}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
