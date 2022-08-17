import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import Server from "@/server/models/Server";
import Member from "@/server/models/Member";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const pool = await useDbPool(e);
	const serverId = e.context.params.sid as string;
	const memberId = e.context.params.mid as string;

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

	const member = await Member.get(pool, server.id, memberId);
	if (!member) {
		throw createError({
			statusCode: 404,
			statusMessage: "Member not found in server",
		});
	}
	return await member.toFullMember(pool);
});
