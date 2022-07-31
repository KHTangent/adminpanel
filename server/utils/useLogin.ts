import { createError, CompatibilityEvent } from "h3";
import User from "@/server/models/User";
import useDbPool from "./useDbPool";

export default async function useLogin(e: CompatibilityEvent): Promise<User> {
	const cookies = useCookies(e);
	if (!cookies.token || cookies.token.length === 0) {
		throw createError({
			statusCode: 401,
		});
	}
	const pool = await useDbPool(e);
	const user = await User.fromToken(pool, cookies.token);
	if (!user) {
		throw createError({
			statusCode: 401,
		});
	}
	return user;
}
