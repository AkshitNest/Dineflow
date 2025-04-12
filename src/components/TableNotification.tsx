
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { checkForTableAvailability, notifyTableAvailable } from '@/services/reservationService';
import { useAuth } from '@/store/authContext';

interface TableNotificationProps {
  reservationId?: string;
  queuePosition?: number | null;
}

const TableNotification: React.FC<TableNotificationProps> = ({ reservationId, queuePosition }) => {
  const [isNotifying, setIsNotifying] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Only listen for notifications if we have a user and a queued reservation
    if (!user || !queuePosition) return;
    
    // Start listening for table availability
    setIsNotifying(true);
    
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
  }, [user, reservationId, queuePosition]);
  
  if (!queuePosition) return null;
  
  return (
    <div className="flex items-center">
      <div className={`mr-2 ${isNotifying ? 'animate-ping' : ''}`}>
        <Bell className="h-4 w-4 text-amber-500" />
      </div>
      <span className="text-sm">
        Waiting in queue: Position #{queuePosition}
      </span>
    </div>
  );
};

export default TableNotification;
