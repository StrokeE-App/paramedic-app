import {user} from '@/firebase/config';
import {redirect} from 'next/navigation';

if (user) {
	console.log(user);
	redirect('/dashboard');
}

export default function LoginLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}
