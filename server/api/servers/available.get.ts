import * as DiscordApi from "@/scripts/DiscordTypes";
import useLogin from "@/server/utils/useLogin";
import { FetchError } from "ohmyfetch";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
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
	return r
		.filter((e) => e.owner)
		.map((e) => {
			let guildIcon = "";
			if (e.icon) {
				guildIcon =
					`https://cdn.discordapp.com/icons/${e.id}/` +
					`${e.icon}${e.icon.startsWith("a_") ? ".gif" : ".png"}`;
			}
			return {
				id: e.id,
				iconUrl: guildIcon,
				name: e.name,
			};
		});
});
