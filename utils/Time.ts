export function getStartOfWeek(date = new Date()) {
	const currentDate = new Date(date);
	const dayOfWeek = currentDate.getDay();
	const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
	currentDate.setDate(currentDate.getDate() + diffToMonday);
	currentDate.setHours(0, 0, 0, 0);
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function getEndOfWeek(date = new Date()) {
	const currentDate = new Date(date);
	const dayOfWeek = currentDate.getDay();
	const diffToSunday = (dayOfWeek === 0 ? 0 : 7) - dayOfWeek;
	currentDate.setDate(currentDate.getDate() + diffToSunday);
	currentDate.setHours(0, 0, 0, 0);
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function getDayOfWeek(dateString) {
	const date = new Date(dateString);
	const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	const dayOfWeek = date.getDay();
	return daysOfWeek[dayOfWeek];
}

export function generateDateRange(startDate, endDate) {
	const start = new Date(startDate);
	const end = new Date(endDate);

	if (start > end) {
		throw new Error('Start date must be before or equal to the end date');
	}

	const dates = [];
	let current = new Date(start);

	while (current <= end) {
		const year = current.getFullYear();
		const month = String(current.getMonth() + 1).padStart(2, '0');
		const day = String(current.getDate()).padStart(2, '0');

		dates.push({ date: `${year}-${month}-${day}`, attendanceTime: '08:00', endAttendance: '18:00' });

		current.setDate(current.getDate() + 1);
	}

	return dates;
}
