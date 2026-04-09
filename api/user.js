const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || '';

function buildUrl(path) {
	if (!path) return BASE_URL;
	if (/^https?:\/\//.test(path)) return path;
	if (!BASE_URL) return path;

	const normalizedBase = BASE_URL.endsWith('/')
		? BASE_URL.slice(0, -1)
		: BASE_URL;
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${normalizedBase}${normalizedPath}`;
}

function toPublicUrl(path) {
	if (!path) return '/placeholder.svg';
	if (/^https?:\/\//.test(path)) return path;
	return buildUrl(path);
}

async function mapTeamMembers(payload) {
	const members = Array.isArray(payload?.data) ? payload.data : [];
	return members
		.filter((member) => member?.isActive !== false)
		.map((member) => ({
			id: member._id,
			name: member.fullName || '',
			designation: member.designation || '',
			photo: toPublicUrl(member.photoUrl),
		}));
}

export async function getCoreTeamMembers() {
	try {
		const response = await fetch(buildUrl('/member/coreTeam'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch core team');
		}

		const payload = await response.json();
		return mapTeamMembers(payload);
	} catch (error) {
		console.warn('Failed to fetch core team members:', error);
		return [];
	}
}

export async function getPastTeamMembers() {
	try {
		const response = await fetch(buildUrl('/pastMembers'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch past team members');
		}

		const payload = await response.json();
		return mapTeamMembers(payload);
	} catch (error) {
		console.warn('Failed to fetch past team members:', error);
		return [];
	}
}

export async function getSuccessfulEvents() {
	try {
		const response = await fetch(buildUrl('/event/successfullEvent'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch successful events');
		}

		const payload = await response.json();
		const events = Array.isArray(payload?.data) ? payload.data : [];

		return events.map((event) => {
			const date = new Date(event.scheduledDate);
			const formattedDate = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
 
			return {
				id: event._id,
				title: event.eventName || '',
				date: formattedDate,
				time: 'TBA',
				location: 'E-Cell Campus',
				speaker: event.speaker || 'TBA',
				description: '',
				category: 'Past Event',
				image: toPublicUrl(event.photoUrl),
			};
		});
	} catch (error) {
		console.warn('Failed to fetch successful events:', error);
		return [];
	}
}

export async function getUpcomingEvents() {
	try {
		const response = await fetch(buildUrl('/event/upcomingEvent'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch upcoming events');
		}

		const payload = await response.json();
		const events = Array.isArray(payload?.data) ? payload.data : [];

		return events.map((event) => {
			const date = new Date(event.scheduledDate);
			const formattedDate = date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

			return {
				id: event._id,
				title: event.eventName || '',
				date: formattedDate,
				time: date.toLocaleTimeString('en-US', {
					hour: '2-digit',
					minute: '2-digit',
				}),
				location: 'E-Cell Campus',
				speaker: event.speaker || 'TBA',
				description: '',
				category: 'Upcoming Event',
				image: toPublicUrl(event.photoUrl),
			};
		});
	} catch (error) {
		console.warn('Failed to fetch upcoming events:', error);
		return [];
	}
}

export async function getCollaborations() {
	try {
		const response = await fetch(buildUrl('/collaborations'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch collaborations');
		}

		const payload = await response.json();
		const collaborations = Array.isArray(payload?.data) ? payload.data : [];

		return collaborations.map((collaboration) => ({
			id: collaboration._id,
			organization: collaboration.name || '',
			image: toPublicUrl(collaboration.photoUrl),
			description: collaboration.about || '',
			events: 'Collaboration Partner',
		}));
	} catch (error) {
		console.warn('Failed to fetch collaborations:', error);
		return [];
	}
}

export async function getStartupList() {
	try {
		const response = await fetch(buildUrl('/startup'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error('Failed to fetch startup list');
		}

		const payload = await response.json();
		const startups = Array.isArray(payload?.data) ? payload.data : [];

		return startups
			.filter((startup) => startup?.isActive !== false)
			.map((startup) => ({
				id: startup._id,
				name: startup.startUpName || '',
				founder: startup.founder || '',
				description: startup.about || '',
				website: startup.website || '',
			}));
	} catch (error) {
		console.warn('Failed to fetch startup list:', error);
		return [];
	}
}

export async function submitJoinForm(payload) {
	try {
		const response = await fetch(buildUrl('/form'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
			cache: 'no-store',
		});

		if (!response.ok) {
			let errorMessage = 'Failed to submit join form';
			try {
				const errorPayload = await response.json();
				errorMessage =
					errorPayload?.message ||
					errorPayload?.error ||
					errorMessage;
			} catch (_error) {
				// Keep default message when error response is not JSON.
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		const responsePayload = await response.json().catch(() => null);
		return {
			success: true,
			message: responsePayload?.message || 'Form submitted successfully.',
			data: responsePayload,
		};
	} catch (error) {
		console.warn('Failed to submit join form:', error);
		return {
			success: false,
			message: 'Unable to submit form right now. Please try again.',
		};
	}
}

export { BASE_URL };
