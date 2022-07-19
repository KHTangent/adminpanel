<template>
	<v-app-bar>
		<v-app-bar-nav-icon>
			<v-icon>
				{{ navIcon }}
			</v-icon>
		</v-app-bar-nav-icon>
		<v-tabs>
			<v-tab to="/"> Home </v-tab>
			<v-tab to="/about"> About </v-tab>
		</v-tabs>
		<v-spacer />
		<v-btn :href="loginUrl"> Login </v-btn>
	</v-app-bar>
</template>

<script lang="ts" setup>
import { mdiGlobeModel } from "@mdi/js";

let loginUrl = ref("");
const navIcon = mdiGlobeModel;
loginUrl.value = await (await $fetch("/api/auth/loginurl")).url;
</script>
