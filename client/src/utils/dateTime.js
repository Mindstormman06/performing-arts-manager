export function localDateTimeToUtcIso(localDateTime) {
	if (!localDateTime) return "";
	const date = new Date(localDateTime);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString();
}

export function localDateAndTimeToUtcIso(datePart, timePart) {
	if (!datePart || !timePart) return "";
	return localDateTimeToUtcIso(`${datePart}T${timePart}`);
}

export function utcToLocalDateTimeInput(utcDateTime) {
	if (!utcDateTime) return "";
	const date = new Date(utcDateTime);
	if (Number.isNaN(date.getTime())) return "";

	const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return local.toISOString().slice(0, 16);
}
