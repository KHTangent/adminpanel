<template>
	<v-container>
		<h1 class="text-h1">Add server</h1>
		<p>Create a new admin panel for a server you own.</p>
		<v-banner
			v-for="(server, i) in servers"
			:key="i"
			lines="two"
			class="my-2"
			:avatar="server.iconUrl"
		>
			<v-banner-text>
				{{ server.id }} <br />
				<strong>{{ server.name }}</strong>
			</v-banner-text>
			<template #actions>
				<v-btn>Create</v-btn>
			</template>
		</v-banner>
	</v-container>
</template>

<script setup lang="ts">
const servers = await $fetch("/api/servers/available", {
	headers: useRequestHeaders(["cookie"]),
});
</script>
