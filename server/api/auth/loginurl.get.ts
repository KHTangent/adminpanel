const AUTHORIZE_URL = "https://discord.com/api/oauth2/authorize";
// const TOKEN_URL = "https://discord.com/api/oauth2/token";
// const REVOKATION_URL = "https://discord.com/api/oauth2/token/revoke";
const OAUTH_SCOPES = "identify";

export default defineEventHandler((e) => {
	const config = useRuntimeConfig();
	const url = new URL(AUTHORIZE_URL);
	url.searchParams.append("client_id", config.discordClientId);
	url.searchParams.append("response_type", "code");
	url.searchParams.append("state", "unused");
	url.searchParams.append("redirect_uri", config.discordRedirectUri);
	url.searchParams.append("scope", OAUTH_SCOPES);
	return {
		url: url.toString(),
	};
});
