export const API_URL = "https://discord.com/api/v10";

export interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
	verified: string;
	email: string;
	flags: number;
	banner: string;
	accent_color: number;
	premium_type: number;
	public_flags: number;
}

export interface GuildPreview {
	id: string;
	name: string;
	icon: string;
	owner: boolean;
	permissions: string;
	features: string[];
}
