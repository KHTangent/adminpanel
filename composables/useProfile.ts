import * as APTypes from "@/scripts/APTypes";

export const useProfile = () =>
	useAsyncData<APTypes.Profile | null>(
		"userprofile",
		async () => {
			const localToken = useLocalLogin();
			if (localToken.value.length > 0) {
				let user: APTypes.Profile;
				try {
					user = await $fetch("/api/user/me", {
						headers: useRequestHeaders(["cookie"]),
					});
				} catch (e) {
					return null;
				}
				return user;
			} else {
				return null;
			}
		},
		{
			watch: [useLocalLogin()],
		}
	);
