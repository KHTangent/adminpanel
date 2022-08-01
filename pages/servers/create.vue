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
				<v-btn @click="setServer(server.id)">Create</v-btn>
			</template>
		</v-banner>
		<ConfirmationDialog
			v-model="confirmationOpen"
			title="Create admin panel?"
			@confirm="createServer"
			@cancel="selectedServerId = ''"
		>
			<p class="text-body-1">
				Are you sure you want to create a new admin panel for
				<strong>{{
					servers.find((e) => e.id === selectedServerId)?.name
				}}</strong
				>?
			</p>
		</ConfirmationDialog>
	</v-container>
</template>

<script setup lang="ts">
const servers = await $fetch("/api/servers/available", {
	headers: useRequestHeaders(["cookie"]),
});

const selectedServerId = ref("");
const confirmationOpen = ref(false);
function setServer(id: string) {
	selectedServerId.value = id;
	confirmationOpen.value = true;
}

async function createServer() {
	console.log("Create server placeholder");
}
</script>
