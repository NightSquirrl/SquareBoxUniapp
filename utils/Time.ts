const holidays = ['2025-01-01', '2025-01-26']; // 假日数组
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
	const currentDate = new Date();
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

		dates.push({ date: `${year}-${month}-${day}`, attendanceTime: '08:00', endAttendance: '00:00' });

		current.setDate(current.getDate() + 1);
	}

	return dates;
}

/** 获取当前日期的最后一天 */
export function getLastDayOfMonth(dateString) {
	const date = new Date(dateString);
	// 设置为下个月的第0天，就会返回本月最后一天
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function formatDate(timestamp) {
	const date = new Date(timestamp);

	// 获取年月日
	const year = date.getFullYear();
	// getMonth() 返回 0-11，需要加1
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	// 拼接成 YYYY-MM-DD 格式
	return `${year}-${month}-${day}`;
}

// 获取本月有多少个工作日
export function getWorkingDaysInCurrentMonth(date = new Date()) {
	const time = date; // 当前日期
	const year = time.getFullYear(); // 当前年份
	const month = time.getMonth(); // 当前月份 (0-11)
	const daysInMonth = new Date(year, month + 1, 0).getDate(); // 当前月的总天数

	let workingDays = 0;

	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month, day);
		const dayOfWeek = date.getDay(); // 获取星期几 (0-6, 0 表示星期日)
		const formattedDate = date.toISOString().split('T')[0];
		// 如果不是周六(6)或周日(0)，则是工作日
		if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formattedDate)) {
			workingDays++;
		}
	}

	return workingDays;
}

//  获取两个时间的工作日
export function workDayBetweenTwoHours(startTime, endTime) {
	let startDate = new Date(startTime);
	let endDate = new Date(endTime);
	let hasWorkingDays = 0;
	if (startDate > endDate) {
		const tempDate = startDate;
		startDate = endDate;
		endDate = tempDate;
	}

	for (let day = 1; day <= endDate.getDate(); day++) {
		const date = new Date(startDate.getFullYear(), startDate.getMonth(), day);
		const dayOfWeek = date.getDay(); // 获取星期几 (0-6, 0 表示星期日)
		const formattedDate = date.toISOString().split('T')[0];
		// 如果不是周六(6)或周日(0)，则是工作日
		if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formattedDate)) {
			hasWorkingDays++;
		}
	}

	return hasWorkingDays;
}

// 获取两个时间之间多少小时
export  function calculateTimeDifference(time1, time2) {
	// 将时间字符串解析为小时和分钟
	const [hour1, minute1] = time1.split(':').map(Number);
	const [hour2, minute2] = time2.split(':').map(Number);

	// 将时间转换为分钟
	const totalMinutes1 = hour1 * 60 + minute1;
	const totalMinutes2 = hour2 * 60 + minute2;

	// 计算分钟差
	const differenceInMinutes = Math.abs(totalMinutes1 - totalMinutes2);

	// 转换为小时并四舍五入保留两位小数
	const differenceInHours = (differenceInMinutes / 60).toFixed(2);

	return parseFloat(differenceInHours);
}
