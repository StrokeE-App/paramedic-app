'use client';

import {createContext, useContext, useEffect, useState, useRef} from 'react';
import {auth} from '@/firebase/config';
import {User} from 'firebase/auth';
import {useRouter} from 'next/navigation';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuthToken: () => void;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	checkAuthToken: () => {},
});

export function AuthProvider({children}: {children: React.ReactNode}) {
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const intervalRef = useRef<NodeJS.Timeout>();
	const timeoutRef = useRef<NodeJS.Timeout>();
	const router = useRouter();

	// Check if the auth token is present in the cookie and set the state accordingly
	const checkAuthToken = () => {
		const authCookie = document.cookie.split('; ').find((row) => row.startsWith('authToken='));

		if (authCookie) {
			setIsAuthenticated(true);
			setIsLoading(false);
			// Clear the interval when token is found
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		}
	};

	// Check if the user is logged in, if not redirect to login page
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			setIsLoading(true);
			setUser(firebaseUser);

			if (!firebaseUser) {
				setIsAuthenticated(false);
				setIsLoading(false);
				router.push('/login');
			} else {
				// If we have a Firebase user, start checking for the auth token
				intervalRef.current = setInterval(checkAuthToken, 500);

				// If the token is not found after 10 seconds, stop the interval and set loading to false
				timeoutRef.current = setTimeout(() => {
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
					}
					setIsLoading(false);
				}, 10000);
			}
		});

		return () => {
			unsubscribe();
			if (intervalRef.current) clearInterval(intervalRef.current);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [router]);

	return <AuthContext.Provider value={{user, isAuthenticated, isLoading, checkAuthToken}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
