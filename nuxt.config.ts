import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
	css: ["vuetify/lib/styles/main.sass"],
	build: {
		transpile: ["vuetify"],
	},
	runtimeConfig: {
		discordClientId: "",
		discordClientSecret: "",
		discordRedirectUri: "",
		discordBotToken: "",
	},
});
