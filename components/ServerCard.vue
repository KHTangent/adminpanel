<template>
	<v-card>
		<v-list lines="two">
			<v-list-item
				:title="server.name"
				:prepend-avatar="server.iconUrl"
				:subtitle="'Owner: ' + server.ownerId"
			/>
		</v-list>
	</v-card>
</template>

<script setup lang="ts">
defineProps({
	server: Object,
});
</script>
