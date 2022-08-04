<template>
	<v-container>
		<div class="d-flex flex-row align-center ma-4">
			<v-avatar :image="server.iconUrl" class="mx-2" />
			<h1 class="text-h3">{{ server.name }}</h1>
		</div>
		<p class="text-body-1">Manage server</p>
	</v-container>
</template>

<script setup lang="ts">
import * as APTypes from "@/scripts/APTypes";

const route = useRoute();
let server: APTypes.Server;
try {
	server = await $fetch(`/api/servers/info/${route.params.id}`, {
		headers: useRequestHeaders(["cookie"]),
	});
} catch (e) {
	await navigateTo("/");
}
</script>
