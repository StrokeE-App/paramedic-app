export type EmergencyPatient = {
	firstName: string;
	lastName: string;
	age: number;
	address?: string;
	weight: number;
	height: number;
	phoneNumber: string;
};

export type EmergencyInfo = {
	emergencyId: string;
	patient: EmergencyPatient;
	startDate: Date;
	nihScale?: number;
	longitude?: number;
	latitude?: number;
	status: 'TO_AMBULANCE' | 'CONFIRMED' | 'DELIVERED';
	// deliveredDate: string | null;
	// emergencyLocation: {latitude: double; longitude: double};
};
