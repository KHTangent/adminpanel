export interface Profile {
	id: string;
	username: string;
	avatarUrl: string;
}

export interface Member {
	serverId: string;
	profile: Profile;
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
