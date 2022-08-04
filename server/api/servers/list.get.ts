import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import Server from "@/server/models/Server";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const pool = await useDbPool(e);
	return (await Server.findAccessible(pool, user.id)).map((e) =>
		e.toFullServer()
	);
});
