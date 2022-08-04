<template>
	<v-card>
		<v-card-text>
			<v-list lines="two">
				<v-list-item
					:title="server.name"
					:prepend-avatar="server.iconUrl"
					:subtitle="'Owner: ' + server.ownerId"
				/>
			</v-list>
		</v-card-text>
		<v-card-actions>
			<v-btn :to="serverUrl">Manage</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
const props = defineProps({
	server: Object,
});
const serverUrl = computed(() => `/panel/${props.server.id}`);
</script>
