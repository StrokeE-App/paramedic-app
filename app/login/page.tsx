import {LoginForm} from '@/components/LoginForm';
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function Login() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
			<StrokeeLogo />
			<LoginForm placeholder="Id. Ambulancia" />
		</main>
	);
}
