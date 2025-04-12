
import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Table, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { checkForTableAvailability, notifyTableAvailable } from '@/services/reservationService';
import { useAuth } from '@/store/authContext';

interface TableNotificationProps {
  reservationId?: string;
  queuePosition?: number | null;
  tableNumber?: string | null;
  status?: string;
}

const TableNotification: React.FC<TableNotificationProps> = ({ 
  reservationId, 
  queuePosition, 
  tableNumber, 
  status 
}) => {
  const [isNotifying, setIsNotifying] = useState(false);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Only listen for notifications if we have a user and a queued reservation
    if (!user || !queuePosition || status !== 'queued') return;
    
    // Start listening for table availability
    setIsNotifying(true);
    
    // Calculate estimated wait time based on queue position (rough estimate)
    // In a real app, this would be more sophisticated based on restaurant data
    const estimatedMinutes = queuePosition * 15; // Rough estimate: 15 mins per position
    setEstimatedWaitTime(estimatedMinutes);
    
    // In a real app, this would set up a websocket connection
    const cleanup = checkForTableAvailability(async (availableReservationId) => {
      // In a real app, this would only fire for the specific reservation
      // For demo purposes, we'll just pretend this is our reservation
      if (reservationId) {
        const updatedReservation = await notifyTableAvailable(reservationId);
        
        if (updatedReservation) {
          toast({
            title: "Table Available!",
            description: `Your table (${updatedReservation.table_number}) is now ready.`,
            variant: "default",
          });
          
          // Play notification sound if available
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Audio notification failed', e));
          
          setIsNotifying(false);
        }
      }
    });
    
    return cleanup;
  }, [user, reservationId, queuePosition, status]);
  
  // Render nothing if we have no position or table
  if (!queuePosition && !tableNumber) return null;
  
  // Render confirmed table information
  if (status === 'confirmed' && tableNumber) {
    return (
      <div className="flex items-center text-green-700">
        <div className="mr-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <span className="font-medium">Confirmed!</span>
          <div className="flex items-center mt-1">
            <Table className="h-4 w-4 mr-1 text-green-600" />
            <span className="text-sm">Table {tableNumber} assigned</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Render queue information
  if (status === 'queued' && queuePosition) {
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`mr-2 ${isNotifying ? 'animate-pulse' : ''}`}>
            <Bell className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-sm font-medium">
            Waiting in queue: Position #{queuePosition}
          </span>
        </div>
        
        {estimatedWaitTime && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>Estimated wait: ~{estimatedWaitTime} minutes</span>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          You'll receive a notification when your table is ready
        </div>
      </div>
    );
  }
  
  return null;
};

export default TableNotification;
