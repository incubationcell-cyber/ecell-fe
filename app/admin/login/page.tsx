import { redirect } from 'next/navigation';
import { loginAdmin } from '../../../api/admin';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';

type LoginPageProps = {
	searchParams?: {
		error?: string;
	};
};

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
	async function handleLogin(formData: FormData) {
		'use server';

		const email = String(formData.get('email') || '').trim();
		const password = String(formData.get('password') || '');

		if (!email || !password) {
			redirect('/admin/login?error=Email%20and%20password%20are%20required');
		}

		const result = await loginAdmin({ email, password });

		if (!result.success) {
			redirect(`/admin/login?error=${encodeURIComponent(result.message)}`);
		}

		redirect('/admin');
	}

	const errorMessage = searchParams?.error;

	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
			<Card className="w-full max-w-md border border-border p-6">
				<h1 className="text-2xl font-bold text-foreground mb-1">Admin Login</h1>
				<p className="text-sm text-muted-foreground mb-6">
					Sign in to continue to the admin dashboard.
				</p>

				{errorMessage ? (
					<p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
						{errorMessage}
					</p>
				) : null}

				<form action={handleLogin} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							required
							placeholder="you@example.com"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							placeholder="Enter your password"
						/>
					</div>

					<Button type="submit" className="w-full">
						Sign In
					</Button>
				</form>
			</Card>
		</div>
	);
}