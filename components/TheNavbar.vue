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
			<v-tab v-if="signedIn" to="/servers"> Servers </v-tab>
		</v-tabs>
		<v-spacer />
		<span v-if="signedIn" class="d-flex flex-row align-center">
			{{ profile.data.value.username }}
			<v-avatar class="ml-3">
				<v-img :src="profile.data.value.avatarUrl" alt="Profile picture" />
			</v-avatar>
		</span>
		<v-btn v-else :href="loginUrl"> Login </v-btn>
	</v-app-bar>
</template>

<script lang="ts" setup>
import { mdiGlobeModel } from "@mdi/js";

let localLogin = useLocalLogin();
let profile = await useProfile();

let loginUrl = ref("");
const signedIn = computed(
	() => localLogin.value.length > 0 && !profile.pending.value
);
const navIcon = mdiGlobeModel;
if (!signedIn.value) {
	loginUrl.value = (await $fetch("/api/auth/loginurl")).url;
}
</script>
