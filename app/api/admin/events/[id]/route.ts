import { NextResponse } from 'next/server';
import { updateUpcomingEvent } from '../../../../../api/admin';

type RouteContext = {
	params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const payload = await request.json();
		const result = await updateUpcomingEvent(id, payload);

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

export async function DELETE(request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const { deleteUpcomingEvent } = await import('../../../../../api/admin');

		const result = await deleteUpcomingEvent(id);

		if (!result.success) {
			return NextResponse.json({ success: false, message: result.message }, { status: 400 });
		}

		return NextResponse.json({ success: true, message: result.message });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Failed to delete upcoming event' },
			{ status: 500 }
		);
	}
}
