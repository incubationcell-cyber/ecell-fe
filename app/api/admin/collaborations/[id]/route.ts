import { NextResponse } from 'next/server';
import { deleteCollaboration, updateCollaboration } from '../../../../../api/admin';

type RouteContext = {
	params: Promise<{ id: string }>;
};

async function updateCollaborationEntry(request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const payload = await request.json();
		const result = await updateCollaboration(id, payload);

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

export async function PUT(request: Request, context: RouteContext) {
	return updateCollaborationEntry(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
	return updateCollaborationEntry(request, context);
}

export async function DELETE(_request: Request, context: RouteContext) {
	const { id } = await context.params;
	const result = await deleteCollaboration(id);

	if (!result.success) {
		return NextResponse.json(
			{ success: false, message: result.message },
			{ status: 400 }
		);
	}

	return NextResponse.json({ success: true, message: result.message });
}