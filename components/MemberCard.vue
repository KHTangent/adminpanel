<template>
	<v-card class="my-2 px-4" color="blue-darken-4">
		<div class="d-flex flex-row align-center">
			<v-avatar>
				<v-img :src="member.avatarUrl" />
			</v-avatar>
			<div class="flex-grow-1">
				<v-card-title>
					{{ member.username }}
				</v-card-title>
				<v-card-text> User ID: {{ member.id }} </v-card-text>
				<v-card-actions class="justify-end">
					<v-btn> Refresh </v-btn>
					<v-btn> Add note </v-btn>
				</v-card-actions>
			</div>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import * as APTypes from "@/scripts/APTypes";

defineProps({
	member: {
		type: Object as PropType<APTypes.Profile>,
		required: true,
	},
});
</script>
