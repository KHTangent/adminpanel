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
