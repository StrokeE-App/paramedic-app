'use client';

import React, {useState, useEffect} from 'react'
import { EmergencyInfo } from '@/types';
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';
export default function EmergencyClientPage({
  params,
}: {
  params: Promise<{ emergencyId: string }>;
}) {
  const { emergencyId } = React.use(params);
  const [emergency, setEmergency] = useState< EmergencyInfo | null >(null);
  const myEmergencyId = emergencyId || "123";
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
  useEffect(() => {
    // Fetch emergency info
    // setEmergency(emergencyInfo);
    // make a new date with the current date and then pass it to a string

    setEmergency({
      emergencyId: myEmergencyId ?? "123", // Ensure emergencyId is a string
      userName: "Juan Perez",
      userPhone: "1234567890",
      userAge: 30,
      userAddress: "Calle 123",
      userWeight: 77.5,
      userHeight: 170.5,
      emergencyTime: fiveMinutesAgo,
      emergencyLocation: "Calle 123",
    });

  }, [emergencyId]);

  return (
    <div>
      <h1 className=''>🔙</h1>
      <EmergencyInfoComponent {...emergency}/>
      <ConfirmStrokeComponent emergencyId={myEmergencyId}/>
    </div>
  )
}