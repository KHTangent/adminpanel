import * as DiscordTypes from "@/scripts/DiscordTypes";
import User from "@/server/models/User";
import { FetchError } from "ohmyfetch";
import useDbPool from "~~/server/utils/useDbPool";
const TOKEN_URL = "https://discord.com/api/oauth2/token";

interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export default defineEventHandler(async (e) => {
	const body = await useBody(e);
	if (!body.code) {
		throw createError({
			statusCode: 400,
			message: "missing code in request body",
		});
	}
	const config = useRuntimeConfig();
	const tokenReqBody = new URLSearchParams({
		grant_type: "authorization_code",
		code: body.code,
		redirect_uri: config.discordRedirectUri,
		client_id: config.discordClientId,
		client_secret: config.discordClientSecret,
	});
	let r: TokenResponse;
	try {
		r = await $fetch(TOKEN_URL, {
			method: "POST",
			body: tokenReqBody,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
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
			message: "failed to get token",
		});
	}

	// Create profile if not exists, and store token
	let profile: DiscordTypes.User;
	try {
		profile = await $fetch("https://discord.com/api/v10/users/@me", {
			headers: {
				Authorization: `Bearer ${r.access_token}`,
			},
		});
	} catch (e) {
		throw createError({
			statusCode: 500,
		});
	}
	const pool = await useDbPool(e);
	let user = await User.fromId(pool, profile.id);
	if (!user) {
		user = (await User.create(
			pool,
			profile.id,
			profile.username,
			profile.avatar
		)) as User;
	}
	const now = new Date();
	now.setSeconds(now.getSeconds() + r.expires_in);
	await user.addToken(pool, r.access_token, now);

	return {
		token: r.access_token,
		expiresIn: r.expires_in,
	};
});
