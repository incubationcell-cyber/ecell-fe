import { NextResponse } from 'next/server';
import { createCollaboration, getCollaborations } from '../../../../api/admin';

export async function GET() {
	const collaborations = await getCollaborations();
	return NextResponse.json({ success: true, data: collaborations });
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const payload = {
			name: String(formData.get('name') || ''),
			about: String(formData.get('about') || ''),
			collaborationImage: formData.get('collaborationImage'),
		};

		const result = await createCollaboration(payload);

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