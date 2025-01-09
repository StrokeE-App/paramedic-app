'use client';

import React, {useState, useEffect} from 'react'
import { EmergencyInfo } from '@/types';
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';
import { ArrowBigLeft } from 'lucide-react';
import Link from 'next/link';
export default function EmergencyClientPage({
  params,
}: {
  params: Promise<{ emergencyId: string }>;
}) {
  const { emergencyId } = React.use(params);
  const [emergency, setEmergency] = useState< EmergencyInfo | null >(null);
  const myEmergencyId = emergencyId || "123";
  //Delete after fetching emergency info
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
  useEffect(() => {
    // Fetch emergency info
    // setEmergency(emergencyInfo);

    // //Delete after fetching emergency info
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
      <div className='text-customRed mt-4 ml-4'>
        <Link href='/dashboard'>
          <ArrowBigLeft size={48}/>
        </Link>
      </div>
      <EmergencyInfoComponent {...emergency}/>
      <ConfirmStrokeComponent emergencyId={myEmergencyId}/>
    </div>
  )
}