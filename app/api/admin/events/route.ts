import { NextResponse } from 'next/server';
import { createUpcomingEvent, getEventCalendar } from '../../../../api/admin';

export async function GET() {
	const events = await getEventCalendar();
	return NextResponse.json({ success: true, data: events });
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const payload = {
			scheduledDate: String(formData.get('scheduledDate') || ''),
			eventName: String(formData.get('eventName') || ''),
			speaker: String(formData.get('speaker') || ''),
			upcomingEventsBanner: formData.get('upcomingEventsBanner'),
		};

		const result = await createUpcomingEvent(payload);

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
