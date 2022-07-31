import useLogin from "@/server/utils/useLogin";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	return user.toFullUser();
});
