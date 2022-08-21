import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import Server from "@/server/models/Server";
import Note from "@/server/models/Note";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const pool = await useDbPool(e);
	const serverId = e.context.params.sid as string;

	// Check existance of server, and permissions
	const server = await Server.fromId(pool, serverId);
	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: "Server not found",
		});
	}
	const accessMode = await server.userHasAccess(pool, user.id);
	if (accessMode === "NONE") {
		throw createError({
			statusCode: 403,
			statusMessage: "You don't have access to this server",
		});
	}

	const notes = await Note.findAll(pool, serverId);
	return notes.map((e) => e.toFullNote());
});
