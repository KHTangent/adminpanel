<template>
	<v-container>
		<v-alert
			v-if="showAlert"
			:type="alertMessage.length === 0 ? 'success' : 'error'"
		>
			{{
				alertMessage.length > 0
					? alertMessage
					: "Server created! Redirecting..."
			}}
		</v-alert>
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
import { FetchError } from "ohmyfetch";
import { delay } from "~~/scripts/Tools.js";

const showAlert = ref(false);
const alertMessage = ref("");

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
	try {
		await $fetch("/api/servers/create", {
			method: "POST",
			body: {
				id: selectedServerId.value,
			},
		});
	} catch (e) {
		showAlert.value = true;
		if (e instanceof FetchError) {
			alertMessage.value = e.message;
		} else {
			alertMessage.value = e.message;
		}
		return;
	}
	showAlert.value = true;
	alertMessage.value = "";
	scrollTo({
		top: 0,
	});
	await delay(2000);
	await navigateTo("/servers");
}
</script>
