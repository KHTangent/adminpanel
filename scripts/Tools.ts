import * as APTypes from "@/scripts/APTypes";

export function delay(ms: number): Promise<void> {
	return new Promise((res) => {
		setTimeout(res, ms);
	});
}

export function getNoteTypeColor(type: APTypes.NoteType) {
	switch (type) {
		case APTypes.NoteType.BAN:
			return "red-lighten-1";
		case APTypes.NoteType.WARNING:
			return "orange";
		case APTypes.NoteType.MUTE:
			return "yellow";
		default:
			return "green";
	}
}

/**
 * Checks if a date is a valid string on the format DD-MM-YYYY
 * Checks for leap year as well. Only works for years 0-5000
 * @param date Date string to check
 * @return An error string for what's wrong with the date. Empty if date is valid
 */
export function validateDate(date: string): string {
	if (!/^\d?\d-\d?\d-\d\d\d\d$/.test(date)) {
		return "Date must be on the format DD-MM-YYYY";
	}
	const [day, month, year] = date.split("-").map((e) => parseInt(e));
	if (year > 5000 || year < 0) {
		return "Invalid year";
	}
	switch (month) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return day < 1 || day > 31 ? "Invalid day" : "";
		case 4:
		case 6:
		case 9:
		case 11:
			return day < 1 || day > 30 ? "Invalid day" : "";
		case 2:
			if (
				(year % 100 === 0 && year % 400 === 0) ||
				(year % 100 !== 0 && year % 4 === 0)
			) {
				return day < 1 || day > 29 ? "Invalid day" : "";
			}
			return day < 1 || day > 28 ? "Invalid day" : "";
		default:
			return "Invalid month";
	}
}
