<template>
	<v-dialog :fullscreen="useDisplay().mobile.value" @click:outside="close()">
		<v-card v-if="member" :width="dialogWidth">
			<v-card-title class="d-flex flex-row justify-space-between">
				<div>
					<v-avatar>
						<v-img :src="member.profile.avatarUrl" />
					</v-avatar>
					{{ member.profile.username }}
				</div>
				<div>
					<v-btn icon @click="close()">
						<v-icon>{{ icons.mdiClose }}</v-icon>
					</v-btn>
				</div>
			</v-card-title>
			<v-card-text>
				<p class="text-caption">User ID: {{ member.profile.id }}</p>
				<v-divider class="my-2" />
				<h2 class="text-h4">User notes</h2>
				<NoteCard
					v-for="(note, i) in member.notes"
					:key="i"
					:note="note"
					@change="refresh()"
				/>
				<p class="text-body-1" v-if="member.notes.length === 0">No notes yet</p>
				<v-divider class="my-2" />
				<v-expansion-panels>
					<v-expansion-panel title="Add note">
						<v-expansion-panel-text>
							<v-row>
								<v-col cols="12" md="8" lg="9">
									<v-text-field
										v-model="addNoteTitle"
										hint="Title of new note"
										label="Title"
										:error-messages="addNoteTitleError"
									/>
								</v-col>
								<v-col cols="12" md="4" lg="3">
									<v-select :items="noteTypeOptions" v-model="addNoteType" />
								</v-col>
								<v-col cols="12">
									<v-textarea
										v-model="addNoteBody"
										label="Note contents"
										:error-messages="addNoteGeneralError"
									/>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="6">
									<v-checkbox v-model="addNoteExpires" label="Note expires" />
								</v-col>
								<v-col cols="12" md="6">
									<v-text-field
										v-model="addNoteExpirityDate"
										:disabled="!addNoteExpires"
										hint="DD-MM-YYYY"
										label="Expirity date"
										:error-messages="addNoteExpirityDateError"
									/>
								</v-col>
							</v-row>
							<v-container class="d-flex justify-end">
								<v-btn @click="submitNewNote()" color="success"> Submit </v-btn>
							</v-container>
						</v-expansion-panel-text>
					</v-expansion-panel>
				</v-expansion-panels>
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
import { mdiClose } from "@mdi/js";
import { validateDate } from "@/scripts/Tools";
import { FetchError } from "ohmyfetch";
import { useDisplay } from "vuetify";

const icons = { mdiClose };

const props = defineProps({
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

const dialogWidth = computed(() => {
	if (useDisplay().mobile.value) return useDisplay().width.value;
	else {
		return Math.min(useDisplay().width.value - 200, 1280);
	}
});

const { data: member, refresh } = await useAsyncData<APTypes.MemberWithNotes>(
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

const noteTypeOptions = Object.values(APTypes.NoteType).map((e) => {
	const temp = e.toString();
	return {
		// Capitalize
		title: e[0].toUpperCase() + e.substring(1),
		value: temp,
	};
});
const addNoteType = ref("note");
const addNoteTitle = ref("");
const addNoteTitleError = ref("");
const addNoteBody = ref("");
const addNoteExpires = ref(false);
const addNoteExpirityDate = ref("");
const addNoteExpirityDateError = ref("");
const addNoteGeneralError = ref("");

async function submitNewNote() {
	if (addNoteTitle.value.trim().length === 0) {
		addNoteTitleError.value = "Title cannot be empty";
		return;
	}
	if (addNoteBody.value.trim().length === 0) {
		addNoteGeneralError.value = "Body cannot be empty";
		return;
	}
	if (addNoteExpires.value) {
		const dateError = validateDate(addNoteExpirityDate.value);
		addNoteExpirityDateError.value = dateError;
		if (dateError.length !== 0) {
			return;
		}
	}
	const newNoteBody: APTypes.CreateNoteRequest = {
		body: addNoteBody.value,
		expires: addNoteExpires.value ? addNoteExpirityDate.value : undefined,
		noteType: addNoteType.value as APTypes.NoteType,
		title: addNoteTitle.value,
	};
	try {
		await $fetch(`/api/server/${props.serverId}/note/${props.memberId}`, {
			method: "POST",
			body: newNoteBody,
		});
		addNoteType.value = "note";
		addNoteTitle.value = "";
		addNoteTitleError.value = "";
		addNoteBody.value = "";
		addNoteExpires.value = false;
		addNoteExpirityDate.value = "";
		addNoteExpirityDateError.value = "";
		addNoteGeneralError.value = "";
		await refresh();
	} catch (e: unknown) {
		if (e instanceof FetchError) {
			addNoteGeneralError.value = e.message;
		} else {
			addNoteGeneralError.value = "Something went wrong while adding note";
		}
	}
}
</script>
