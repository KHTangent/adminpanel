<template>
	<v-card class="ma-2" :color="needsAttention ? 'red-darken-3' : 'accent'">
		<v-card-title class="d-flex flex-row align-center justify-space-between">
			{{ note.title }}
			<v-chip :color="getChipColor(note.noteType)" class="ml-4">
				{{ note.noteType }}
			</v-chip>
		</v-card-title>
		<v-card-text>
			<div>
				<span v-if="hasExpirity" class="text-caption">
					Expires at {{ expires.toLocaleDateString() }}
				</span>
			</div>
			<p class="text-body-1 mb-4 mt-2">
				{{ note.body }}
			</p>
			<div class="d-flex flex-row justify-start align-center">
				<span class="text-caption" :title="createdAt.toLocaleString()">
					Created at {{ createdAt.toLocaleDateString() }}
				</span>
				<div class="d-flex flex-row align-center ml-1">
					<span class="text-caption mr-1"> by </span>
					<v-avatar
						v-if="creatorProfile.avatarUrl.length > 0"
						class="mr-1"
						:size="24"
					>
						<v-img :src="creatorProfile.avatarUrl" />
					</v-avatar>
					<span class="text-caption">
						{{ creatorProfile.username }}
					</span>
				</div>
			</div>
		</v-card-text>
		<v-card-actions v-if="!note.resolved" class="justify-end">
			<v-btn :disabled="resolving" @click="resolveNote()">
				{{ resolving ? "Resolving..." : "Mark resolved" }}
			</v-btn>
		</v-card-actions>
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
const emit = defineEmits(["changed"]);

const userCache = useUserCache();

// Ugly code because JSON does not support date type, so this is actually a string
const createdAt = computed(() => new Date(props.note.createdAt.toString()));
const expires = computed(() => new Date(props.note.expires.toString()));
const hasExpirity = computed(
	() =>
		!(
			!props.note.expires ||
			(props.note.expires as unknown as string).length === 0
		)
);

const needsAttention = computed(
	() => !props.note.resolved && hasExpirity.value && expires.value < new Date()
);

let creatorProfile = userCache.value[props.note.createdBy];
if (!creatorProfile) {
	creatorProfile = {
		avatarUrl: "",
		username: "unknown",
	};
}

function getChipColor(type: APTypes.NoteType): string {
	return getNoteTypeColor(type);
}

const resolving = ref(false);
async function resolveNote() {
	resolving.value = true;
	await $fetch(
		`/api/server/${props.note.serverId}/note/resolve/${props.note.noteId}`,
		{
			method: "POST",
		}
	);
	emit("changed");
	props.note.resolved = true;
	resolving.value = false;
}
</script>
