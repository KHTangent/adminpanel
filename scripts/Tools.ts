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
