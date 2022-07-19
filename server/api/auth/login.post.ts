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
		return createError({
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
		console.log(e);
		return createError({
			statusCode: 401,
			message: "failed to get token",
		});
	}
	return {
		token: r.access_token,
		expiresIn: r.expires_in,
	};
});
