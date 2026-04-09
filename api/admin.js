import { cookies } from 'next/headers';

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

function parseSetCookieAttributes(cookieString) {
	const parts = cookieString.split(';').map((part) => part.trim());
	const [nameValue, ...attributes] = parts;

	if (!nameValue) return null;

	const separatorIndex = nameValue.indexOf('=');
	if (separatorIndex === -1) return null;

	const name = nameValue.slice(0, separatorIndex);
	const value = nameValue.slice(separatorIndex + 1);

	const options = {
		path: '/',
	};

	for (const attribute of attributes) {
		const [rawKey, ...rawValueParts] = attribute.split('=');
		const key = rawKey?.toLowerCase();
		const attributeValue = rawValueParts.join('=');

		if (key === 'httponly') options.httpOnly = true;
		if (key === 'secure') options.secure = true;
		if (key === 'path' && attributeValue) options.path = attributeValue;
		if (key === 'domain' && attributeValue) options.domain = attributeValue;
		if (key === 'samesite' && attributeValue) options.sameSite = attributeValue;
		if (key === 'expires' && attributeValue) {
			const expires = new Date(attributeValue);
			if (!Number.isNaN(expires.getTime())) options.expires = expires;
		}
		if (key === 'max-age' && attributeValue) {
			const maxAge = Number.parseInt(attributeValue, 10);
			if (!Number.isNaN(maxAge)) options.maxAge = maxAge;
		}
	}

	return { name, value, options };
}

async function persistResponseCookies(response) {
	const cookieStore = await cookies();
	const setCookieHeaders = response.headers.getSetCookie?.() || [];

	for (const cookieString of setCookieHeaders) {
		const parsedCookie = parseSetCookieAttributes(cookieString);
		if (!parsedCookie) continue;

		cookieStore.set(parsedCookie.name, parsedCookie.value, parsedCookie.options);
	}
}

async function getRequestCookieHeader() {
	const cookieStore = await cookies();
	const allCookies = cookieStore.getAll();

	if (!allCookies.length) return '';

	return allCookies
		.map(({ name, value }) => `${name}=${value}`)
		.join('; ');
}

export async function adminRequest(path, options = {}) {
	const cookieHeader = await getRequestCookieHeader();
	const url = buildUrl(path);
	const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
	const mergedHeaders = {
		...(isFormData ? {} : { 'Content-Type': 'application/json' }),
		...(options.headers || {}),
		...(cookieHeader ? { Cookie: cookieHeader } : {}),
	};

	const response = await fetch(url, {
		method: options.method || 'GET',
		headers: mergedHeaders,
		body: options.body,
		cache: options.cache || 'no-store',
	});

	return response;
}

export async function loginAdmin({ email, password }) {
	try {
		const response = await fetch(buildUrl('/admin/login'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
			cache: 'no-store',
		});

		const payload = await response.json();

		if (!response.ok) {
			throw new Error(payload?.message || 'Failed to login');
		}

		await persistResponseCookies(response);

		return {
			success: true,
			message: payload?.message || 'Login successful',
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to login',
		};
	}
}

function toPublicUrl(path) {
	if (!path) return '/placeholder.svg';
	if (/^https?:\/\//.test(path)) return path;
	return buildUrl(path);
}

function normalizeStartup(startup) {
	return {
		id: startup?._id || '',
		startUpName: startup?.startUpName || '',
		founder: startup?.founder || '',
		about: startup?.about || '',
		website: startup?.website || '',
		isActive: startup?.isActive !== false,
		createdAt: startup?.createdAt || '',
		updatedAt: startup?.updatedAt || '',
	};
}

function normalizeCollaboration(collaboration) {
	return {
		id: collaboration?._id || '',
		organization: collaboration?.name || '',
		image: toPublicUrl(collaboration?.photoUrl),
		description: collaboration?.about || '',
		createdAt: collaboration?.createdAt || '',
		updatedAt: collaboration?.updatedAt || '',
	};
}

function normalizeCoreTeamMember(member) {
	return {
		id: member?._id || '',
		name: member?.fullName || '',
		designation: member?.designation || '',
		image: toPublicUrl(member?.photoUrl),
		isActive: member?.isActive !== false,
		createdAt: member?.createdAt || '',
		updatedAt: member?.updatedAt || '',
	};
}

function normalizeEventCalendarItem(eventItem) {
	const eventDate = eventItem?.scheduledDate ? new Date(eventItem.scheduledDate) : null;
	const formattedDate = eventDate && !Number.isNaN(eventDate.getTime())
		? eventDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
		: '';
	const formattedTime = eventItem?.scheduledDate && String(eventItem.scheduledDate).includes('T')
		? String(eventItem.scheduledDate).split('T')[1]?.slice(0, 8) || 'TBA'
		: 'TBA';

	return {
		id: eventItem?._id || '',
		title: eventItem?.eventName || '',
		date: formattedDate,
		time: formattedTime,
		location: 'TBA',
		description: eventItem?.speaker ? `Speaker: ${eventItem.speaker}` : '',
		category: 'Event',
		image: toPublicUrl(eventItem?.photoUrl),
		scheduledDate: eventItem?.scheduledDate || '',
		speaker: eventItem?.speaker || '',
		createdAt: eventItem?.createdAt || '',
		updatedAt: eventItem?.updatedAt || '',
	};
}

function mapCollaborationPayload(collaborationData = {}) {
	return {
		name: collaborationData.organization || collaborationData.name || '',
		about: collaborationData.description || collaborationData.about || '',
	};
}

async function parseAdminJson(response, fallbackMessage) {
	let payload = null;

	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		throw new Error(payload?.message || `${fallbackMessage}: ${response.status}`);
	}

	return payload;
}

export async function getStartups() {
	try {
		const response = await adminRequest('/admin/startup', {
			method: 'GET',
		});

		const payload = await parseAdminJson(response, 'Failed to fetch startups');
		const startups = Array.isArray(payload?.data) ? payload.data : [];

		return startups.map(normalizeStartup);
	} catch (error) {
		console.error('Failed to fetch startups:', error);
		return [];
	}
}

export async function createStartup(startupData) {
	try {
		const response = await adminRequest('/admin/startup', {
			method: 'POST',
			body: JSON.stringify(startupData),
		});

		const payload = await parseAdminJson(response, 'Failed to create startup');

		return {
			success: true,
			message: payload?.message || 'Startup created successfully',
			data: normalizeStartup(payload?.data),
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to create startup',
			data: null,
		};
	}
}

export async function updateStartup(startupId, startupData) {
	if (!startupId) {
		return {
			success: false,
			message: 'Startup id is required',
			data: null,
		};
	}

	try {
		const response = await adminRequest(`/admin/startup/${startupId}`, {
			method: 'PUT',
			body: JSON.stringify(startupData),
		});

		const payload = await parseAdminJson(response, 'Failed to update startup');

		return {
			success: true,
			message: payload?.message || 'Startup updated successfully',
			data: normalizeStartup(payload?.data),
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to update startup',
			data: null,
		};
	}
}

export async function deleteStartup(startupId) {
	if (!startupId) {
		return {
			success: false,
			message: 'Startup id is required',
		};
	}

	try {
		const response = await adminRequest(`/admin/startup/${startupId}`, {
			method: 'DELETE',
		});

		const payload = await parseAdminJson(response, 'Failed to delete startup');

		return {
			success: true,
			message: payload?.message || 'Startup deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to delete startup',
		};
	}
}

export async function getCollaborations() {
	try {
		const response = await adminRequest('/admin/collaborations', {
			method: 'GET',
		});

		const payload = await parseAdminJson(response, 'Failed to fetch collaborations');
		const collaborations = Array.isArray(payload?.data) ? payload.data : [];

		return collaborations.map(normalizeCollaboration);
	} catch (error) {
		console.error('Failed to fetch collaborations:', error);
		return [];
	}
}

export async function getEventCalendar() {
	try {
		const response = await adminRequest('/admin/eventCalendar', {
			method: 'GET',
		});

		const payload = await parseAdminJson(response, 'Failed to fetch event calendar');
		const events = Array.isArray(payload?.data) ? payload.data : [];

		return events.map(normalizeEventCalendarItem);
	} catch (error) {
		console.error('Failed to fetch event calendar:', error);
		return [];
	}
}

export async function createUpcomingEvent(eventData) {
	try {
		const formData = new FormData();
		const scheduledDate = eventData?.scheduledDate || '';
		const eventName = eventData?.eventName || '';
		const speaker = eventData?.speaker || '';
		const upcomingEventsBanner = eventData?.upcomingEventsBanner || null;

		formData.append('scheduledDate', String(scheduledDate));
		formData.append('eventName', String(eventName));
		formData.append('speaker', String(speaker));

		if (upcomingEventsBanner && typeof upcomingEventsBanner !== 'string') {
			formData.append(
				'upcomingEventsBanner',
				upcomingEventsBanner,
				upcomingEventsBanner.name || 'upcoming-event-banner'
			);
		}

		const response = await adminRequest('/admin/upcomingevent', {
			method: 'POST',
			body: formData,
		});

		const payload = await parseAdminJson(response, 'Failed to create upcoming event');

		return {
			success: true,
			message: payload?.message || 'Upcoming event created successfully',
			data: payload?.data || null,
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to create upcoming event',
			data: null,
		};
	}
}

export async function updateUpcomingEvent(eventId, eventData) {
	if (!eventId) {
		return {
			success: false,
			message: 'Event id is required',
			data: null,
		};
	}

	try {
		const payload = {
			scheduledDate: eventData?.scheduledDate || '',
			eventName: eventData?.eventName || '',
			speaker: eventData?.speaker || '',
		};

		const response = await adminRequest(`/admin/upcomingevent/${eventId}`, {
			method: 'PATCH',
			body: JSON.stringify(payload),
		});

		const responsePayload = await parseAdminJson(response, 'Failed to update upcoming event');

		return {
			success: true,
			message: responsePayload?.message || 'Upcoming event updated successfully',
			data: responsePayload?.data || null,
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to update upcoming event',
			data: null,
		};
	}
}

export async function getCoreTeamMembersAdmin() {
	try {
		const response = await adminRequest('/member/coreTeam', {
			method: 'GET',
		});

		const payload = await parseAdminJson(response, 'Failed to fetch core team members');
		const members = Array.isArray(payload?.data) ? payload.data : [];

		return members.map(normalizeCoreTeamMember);
	} catch (error) {
		console.error('Failed to fetch core team members:', error);
		return [];
	}
}

export async function createCoreTeamMember(memberData) {
	try {
		const formData = new FormData();
		const fullName = memberData?.name || memberData?.fullName || '';
		const designation = memberData?.designation || '';
		const isActive =
			memberData?.isActive === false || String(memberData?.isActive).toLowerCase() === 'false'
				? 'false'
				: 'true';
		const memberImage = memberData?.memberImage || null;

		formData.append('fullName', String(fullName));
		formData.append('designation', String(designation));
		formData.append('isActive', isActive);

		if (memberImage && typeof memberImage !== 'string') {
			formData.append('memberImage', memberImage, memberImage.name || 'member-image');
		}

		const response = await adminRequest('/admin/coreteam/addNewMember', {
			method: 'POST',
			body: formData,
		});

		const payload = await parseAdminJson(response, 'Failed to create core team member');

		return {
			success: true,
			message: payload?.message || 'Core team member added successfully',
			data: normalizeCoreTeamMember(payload?.data),
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to create core team member',
			data: null,
		};
	}
}

export async function updateCoreTeamMember(memberId, memberData) {
	if (!memberId) {
		return {
			success: false,
			message: 'Member id is required',
			data: null,
		};
	}

	try {
		const payload = {
			fullName: memberData?.name || memberData?.fullName || '',
			designation: memberData?.designation || '',
			isActive:
				memberData?.isActive === false || String(memberData?.isActive).toLowerCase() === 'false'
					? false
					: true,
		};

		const response = await adminRequest(`/admin/coreteam/${memberId}`, {
			method: 'PATCH',
			body: JSON.stringify(payload),
		});

		const responsePayload = await parseAdminJson(response, 'Failed to update core team member');

		return {
			success: true,
			message: responsePayload?.message || 'Core team member updated successfully',
			data: normalizeCoreTeamMember(responsePayload?.data),
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to update core team member',
			data: null,
		};
	}
}

export async function createCollaboration(collaborationData) {
	try {
		const formData = new FormData();
		const name = collaborationData?.organization || collaborationData?.name || '';
		const about = collaborationData?.description || collaborationData?.about || '';
		const imageValue = collaborationData?.collaborationImage || null;

		formData.append('name', String(name));
		formData.append('about', String(about));

		if (imageValue && typeof imageValue !== 'string') {
			formData.append('collaborationImage', imageValue, imageValue.name || 'upload-image');
		}

		const response = await adminRequest('/admin/create/collaborations', {
			method: 'POST',
			body: formData,
		});

		const payload = await parseAdminJson(response, 'Failed to create collaboration');

		return {
			success: true,
			message: payload?.message || 'Collaboration created successfully',
			data: normalizeCollaboration(payload?.data),
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to create collaboration',
			data: null,
		};
	}
}

export async function updateCollaboration(collaborationId, collaborationData) {
	if (!collaborationId) {
		return {
			success: false,
			message: 'Collaboration id is required',
			data: null,
		};
	}

	try {
		const updatePayload = {
			name: collaborationData?.organization || collaborationData?.name || '',
			about: collaborationData?.description || collaborationData?.about || '',
		};

		const response = await adminRequest(`/admin/collaborations/${collaborationId}`, {
			method: 'PATCH',
			body: JSON.stringify(updatePayload),
		});

		const payload = await parseAdminJson(response, 'Failed to update collaboration');

		return {
			success: true,
			message: payload?.message || 'Collaboration updated successfully',
			data: normalizeCollaboration(payload?.data),
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to update collaboration',
			data: null,
		};
	}
}

export async function deleteCollaboration(collaborationId) {
	if (!collaborationId) {
		return {
			success: false,
			message: 'Collaboration id is required',
		};
	}

	try {
		const response = await adminRequest(`/admin/collaborations/${collaborationId}`, {
			method: 'DELETE',
		});

		const payload = await parseAdminJson(response, 'Failed to delete collaboration');

		return {
			success: true,
			message: payload?.message || 'Collaboration deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: error?.message || 'Failed to delete collaboration',
		};
	}
}

export { BASE_URL };
