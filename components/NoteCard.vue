<template>
	<v-card class="ma-2">
		<v-card-title class="d-flex flex-row align-center justify-space-between">
			{{ note.title }}
			<v-chip :color="getChipColor(note.noteType)" class="ml-4">
				{{ note.noteType }}
			</v-chip>
		</v-card-title>
		<v-card-text>
			<div class="d-flex flex-row justify-space-between align-center">
				<div></div>
			</div>
			<p class="text-body-1 mb-4">
				{{ note.body }}
			</p>
			<div class="d-flex flex-row justify-space-between align-center">
				<div>
					<span class="text-caption" :title="createdAt.toLocaleString()">
						Created at {{ createdAt.toLocaleDateString() }}
					</span>
					<span
						class="text-caption"
						v-if="profile && profile.id === note.createdBy"
					>
						<!-- TODO: Make this work for other users as well -->
						by
						<v-avatar class="mx-1" :size="24">
							<v-img :src="profile.avatarUrl" />
						</v-avatar>
						{{ profile.username }}
					</span>
				</div>
			</div>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import * as APTypes from "@/scripts/APTypes";
import { getNoteTypeColor } from "@/scripts/Tools";

const props = defineProps({
	note: {
		type: Object as PropType<APTypes.Note>,
		required: true,
	},
});

const { data: profile } = await useProfile();

// Ugly code because JSON does not support date type, so this is actually a string
const createdAt = computed(() => new Date(props.note.createdAt.toString()));

function getChipColor(type: APTypes.NoteType): string {
	return getNoteTypeColor(type);
}
</script>
