import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import * as DiscordTypes from "@/scripts/DiscordTypes";
import Server from "@/server/models/Server";
import { FetchError } from "ohmyfetch";
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
	if (accessMode !== "FULL") {
		throw createError({
			statusCode: 403,
			statusMessage: "You don't have write access to this server",
		});
	}

	// Fetch member profile
	const botToken = useRuntimeConfig().discordBotToken;
	let profile: DiscordTypes.PublicUser;
	try {
		profile = await $fetch(DiscordTypes.API_URL + "/users/" + memberId, {
			headers: {
				Authorization: `Bot ${botToken}`,
			},
		});
	} catch (e: unknown) {
		if (e instanceof FetchError) {
			if (e.message.startsWith("404")) {
				throw createError({
					statusCode: 404,
					statusMessage: "User not found",
				});
			}
		}
		console.error(e);
		throw createError({
			statusCode: 500,
		});
	}
	return await Member.create(
		pool,
		profile.id,
		serverId,
		profile.username + "#" + profile.discriminator,
		profile.avatar
	);
});
