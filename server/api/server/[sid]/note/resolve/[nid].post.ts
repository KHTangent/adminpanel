import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import Server from "@/server/models/Server";
import Note from "@/server/models/Note";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const pool = await useDbPool(e);
	const serverId = e.context.params.sid as string;
	const noteId = e.context.params.nid as string;

	// Check existance of server, and permissions
	const server = await Server.fromId(pool, serverId);
	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: "Server not found",
		});
	}
	const accessMode = await server.userHasAccess(pool, user.id);
	if (accessMode !== "FULL") {
		throw createError({
			statusCode: 403,
			statusMessage: "You don't have write access to this server",
		});
	}

	const note = await Note.fromId(pool, noteId);
	if (!note || note.serverId !== serverId) {
		throw createError({
			statusCode: 404,
			statusMessage: "Not not found in this server",
		});
	}
	await note.resolve(pool);

	return note.toFullNote();
});
