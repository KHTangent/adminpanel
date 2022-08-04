import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import Server from "@/server/models/Server";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const pool = await useDbPool(e);
	const serverId = e.context.params.id as string;
	const server = await Server.fromId(pool, serverId);
	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: "server not found",
		});
	}
	if ((await server.userHasAccess(pool, user.id)) != "FULL") {
		throw createError({
			statusCode: 401,
			statusMessage: "you don't have access to this server",
		});
	}
	return server.toFullServer();
});
