'use client';

import {useState} from 'react';
import {SignIn} from '@/firebase/config';

type LoginFormProps = {
	placeholder?: string;
};

export function LoginForm({placeholder = 'Usuario'}: LoginFormProps) {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// console.log('Login attempt:', {username, password});
		await SignIn(username, password);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
			<div className="space-y-4">
				<div>
					<input
						type="email"
						placeholder={placeholder}
						value={username}
						onChange={(e) => setUserName(e.target.value)}
						className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
						required
					/>
				</div>
				<div>
					<input
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
						required
					/>
				</div>
			</div>
			<button
				type="submit"
				className="w-full px-4 py-3 text-white bg-customRed rounded-full hover:bg-gustomRed focus:outline-none focus:ring-2 focus:ring-customRed focus:ring-offset-2 transition-colors"
			>
				Iniciar Sesión
			</button>
		</form>
	);
}
