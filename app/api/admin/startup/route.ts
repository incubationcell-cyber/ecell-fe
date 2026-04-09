import { NextResponse } from 'next/server';
import { createStartup, getStartups } from '../../../../api/admin';

export async function GET() {
	const startups = await getStartups();
	return NextResponse.json({ success: true, data: startups });
}

export async function POST(request: Request) {
	try {
		const payload = await request.json();
		const result = await createStartup(payload);

		if (!result.success) {
			return NextResponse.json(
				{ success: false, message: result.message },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			message: result.message,
			data: result.data,
		});
	} catch {
		return NextResponse.json(
			{ success: false, message: 'Invalid request payload' },
			{ status: 400 }
		);
	}
}