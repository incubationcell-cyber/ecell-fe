import { NextResponse } from 'next/server';
import { createCoreTeamMember, getCoreTeamMembersAdmin } from '../../../../api/admin';

export async function GET() {
	const members = await getCoreTeamMembersAdmin();
	return NextResponse.json({ success: true, data: members });
}

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const payload = {
			fullName: String(formData.get('fullName') || ''),
			designation: String(formData.get('designation') || ''),
			isActive: String(formData.get('isActive') || 'true'),
			memberImage: formData.get('memberImage'),
		};

		const result = await createCoreTeamMember(payload);

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
