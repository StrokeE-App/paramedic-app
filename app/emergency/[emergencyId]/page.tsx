'use client';

import React, {useState, useEffect} from 'react';
import {EmergencyInfo} from '@/types';
import {ArrowBigLeft} from 'lucide-react';
import Link from 'next/link';

// Mocks
import {emergency1} from '@/mocks/emergency';

// Components
import EmergencyInfoComponent from '@/components/EmergencyInfoComponent';
import ConfirmStrokeComponent from '@/components/ConfirmStrokeComponent';

export default function EmergencyClientPage({params}: {params: Promise<{emergencyId: string}>}) {
	const {emergencyId} = React.use(params);
	const [emergency, setEmergency] = useState<EmergencyInfo | null>(null);
	const myEmergencyId = emergencyId || '123';

	useEffect(() => {
		// Fetch emergency info
		// setEmergency(emergencyInfo);
		// make a new date with the current date and then pass it to a string

		// Delete after fetching emergency info
		setEmergency(emergency1);
	}, [emergencyId]);

	return (
		<div>
			<div className="text-customRed mt-4 ml-4">
				<Link href="/dashboard">
					<ArrowBigLeft size={48} />
				</Link>
			</div>
			<EmergencyInfoComponent {...emergency} />
			<ConfirmStrokeComponent emergencyId={myEmergencyId} />
		</div>
	);
}
