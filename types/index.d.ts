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
	// emergencyLocation: {latitude: double; longitude: double};
};

export type ParamedicData = {
	firstName: string;
	lastName: string;
	ambulanceId: string;
	email: string;
}

export type ParamedicResponse = {
	message: string;
	data: ParamedicData;
}