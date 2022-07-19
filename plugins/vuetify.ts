// Credit: https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html#configure-nuxt-3-to-use-our-new-plugin

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		components,
		directives,
		theme: {
			defaultTheme: "dark",
		},
		icons: {
			aliases,
			sets: {
				mdi,
			},
			defaultSet: "mdi",
		},
	});
	nuxtApp.vueApp.use(vuetify);
});
