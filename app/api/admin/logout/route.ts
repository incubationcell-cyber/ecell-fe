import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
	const cookieStore = await cookies();
	const existingCookies = cookieStore.getAll();

	for (const cookie of existingCookies) {
		if (cookie.name === 'token' || cookie.name === '.Tunnels.Relay.WebForwarding.Cookies') {
			cookieStore.delete(cookie.name);
		}
	}

	return NextResponse.json({ message: 'Logged out successfully' });
}