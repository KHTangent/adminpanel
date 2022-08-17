<template>
	<v-dialog max-width="1280px" v-model="modelValue">
		<v-card v-if="member">
			<v-card-title>
				<v-avatar>
					<v-img :src="member.profile.avatarUrl" />
				</v-avatar>
				{{ member.profile.username }}
			</v-card-title>
			<v-card-text>
				<p class="text-caption">User ID: {{ member.profile.id }}</p>
				<v-divider class="my-2" />
				<h2 class="text-h4">User notes</h2>
				<NoteCard v-for="(note, i) in member.notes" :key="i" :note="note" />
				<p class="text-body-1" v-if="member.notes.length === 0">No notes yet</p>
			</v-card-text>
			<v-card-actions class="justify-end">
				<v-btn @click="close()">Close</v-btn>
			</v-card-actions>
		</v-card>
		<v-card v-else>
			<p class="text-body-1">Loading member...</p>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import * as APTypes from "@/scripts/APTypes";

const props = defineProps({
	modelValue: {
		default: false,
		type: Boolean,
	},
	memberId: {
		type: String,
		required: true,
	},
	serverId: {
		type: String,
		required: true,
	},
});
const emit = defineEmits(["update:modelValue"]);
function close() {
	emit("update:modelValue", false);
}
const { data: member } = await useAsyncData<APTypes.MemberWithNotes>(
	() => {
		if (props.memberId.length === 0 || props.serverId.length === 0) return null;
		return $fetch<APTypes.MemberWithNotes>(
			`/api/server/${props.serverId}/member/${props.memberId}`,
			{
				headers: useRequestHeaders(["cookie"]),
			}
		);
	},
	{
		watch: [props],
	}
);
</script>
