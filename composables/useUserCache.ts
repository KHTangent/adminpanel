interface Profile {
	avatarUrl: string;
	username: string;
}

type ProfileCache = Record<string, Profile>;

export const useUserCache = () =>
	useState<ProfileCache>("usercache", () => {
		return {};
	});
