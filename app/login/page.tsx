'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

// Firebase
import {auth} from '@/firebase/config';

// Components
import {LoginForm} from '@/components/LoginForm';
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function Login() {
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				router.push('/dashboard');
			}
		});

		return () => unsubscribe();
	}, [router]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8">
			<StrokeeLogo />
			<LoginForm placeholder="Id. Ambulancia" />
		</main>
	);
}
