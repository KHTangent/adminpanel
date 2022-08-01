import * as DiscordApi from "@/scripts/DiscordTypes";
import useLogin from "@/server/utils/useLogin";
import Server from "@/server/models/Server";
import { FetchError } from "ohmyfetch";
import useDbPool from "~~/server/utils/useDbPool";

interface CreateServerRequest {
	id: string;
}

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const body = await useBody<CreateServerRequest>(e);
	let r: DiscordApi.GuildPreview[];
	try {
		r = await $fetch(DiscordApi.API_URL + "/users/@me/guilds", {
			headers: {
				Authorization: `Bearer ${user.getToken()}`,
			},
		});
	} catch (e: unknown) {
		if (e instanceof FetchError && e.message.startsWith("4")) {
			throw createError({
				statusCode: 401,
			});
		}
		console.error(e);
		throw createError({
			statusCode: 500,
		});
	}
	const ownedServer = r.find((e) => e.owner && e.id === body.id);
	if (!ownedServer) {
		throw createError({
			statusCode: 400,
			statusMessage: "you don't own a server with that id",
		});
	}
	const dbPool = await useDbPool(e);
	await Server.create(
		dbPool,
		ownedServer.id,
		user.id,
		ownedServer.name,
		ownedServer.icon
	);
	return 200;
});
