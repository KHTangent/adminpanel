export interface Profile {
	id: string;
	username: string;
	avatarUrl: string;
}

export interface MemberSummary {
	serverId: string;
	profile: Profile;
}

export interface Note {
	noteId: string;
	serverId: string;
	userId: string;
	title: string;
	noteType: NoteType;
	body: string;
	createdAt: Date;
	createdBy: string;
	resolved: boolean;
	expires: Date | null;
}

export interface MemberWithNotes {
	serverId: string;
	profile: Profile;
	notes: Note[];
}

export interface CreateNoteRequest {
	title: string;
	noteType: NoteType;
	body: string;
	expires?: string;
}

export interface Server {
	id: string;
	name: string;
	ownerId: string;
	iconUrl: string;
}

export enum NoteType {
	NOTE = "note",
	WARNING = "warning",
	MUTE = "mute",
	BAN = "ban",
}
