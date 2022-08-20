<template>
	<v-container>
		<div class="d-flex flex-row align-center ma-2">
			<v-avatar :image="server.iconUrl" class="mr-2" />
			<h1 class="text-h3">{{ server.name }}</h1>
		</div>
		<v-expansion-panels
			class="my-6"
			multiple
			variant="accordion"
			v-model="openedPanels"
		>
			<v-expansion-panel title="Expired notes" :value="0">
				<v-expansion-panel-text>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus
						tempora ea vel porro inventore facere enim aspernatur velit commodi
						vero ipsam laboriosam laborum ullam nobis obcaecati, cumque, earum
						animi? Nisi!
					</p>
				</v-expansion-panel-text>
			</v-expansion-panel>
			<v-expansion-panel title="Expiring notes" :value="1">
				<v-expansion-panel-text>
					<p>
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex nisi
						eum maiores labore consequatur, harum similique rerum facilis quos
						pariatur sed maxime earum id aperiam non quidem dolore saepe atque!
					</p>
				</v-expansion-panel-text>
			</v-expansion-panel>
			<v-expansion-panel title="Members" :value="2">
				<v-expansion-panel-text>
					<v-text-field
						class="my-2"
						:error="addMemberError.length !== 0"
						:error-messages="addMemberError"
						placeholder="Add member by ID"
						hint="Find the user ID by right-clicking a user while developer mode is active"
						v-model="addMemberId"
					>
						<template #append>
							<v-btn
								:prepend-icon="icons.mdiPlus"
								color="success"
								class="mt-n2"
								@click="addMember()"
							>
								Add
							</v-btn>
						</template>
					</v-text-field>
					<MemberCard
						v-for="(member, i) in members"
						:key="i"
						:member="member.profile"
						@open="viewMember(i)"
					/>
					<p v-if="members.length === 0" class="text-caption">
						No members have been added to this server yet.
					</p>
					<MemberDialog
						v-model="memberDialogOpen"
						:serverId="server.id"
						:memberId="memberDialogMember"
					/>
				</v-expansion-panel-text>
			</v-expansion-panel>
			<v-expansion-panel title="Server settings" :value="3">
				<v-expansion-panel-text>
					<p>
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex nisi
						eum maiores labore consequatur, harum similique rerum facilis quos
						pariatur sed maxime earum id aperiam non quidem dolore saepe atque!
					</p>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-container>
</template>

<script setup lang="ts">
import { mdiPlus } from "@mdi/js";
import * as APTypes from "@/scripts/APTypes";
import { FetchError } from "ohmyfetch";
const icons = { mdiPlus };

const route = useRoute();
let server: APTypes.Server;
try {
	server = await $fetch(`/api/servers/info/${route.params.id}`, {
		headers: useRequestHeaders(["cookie"]),
	});
} catch (e) {
	await navigateTo("/");
}
const openedPanels = ref([0]); // Open the first panel by default

const { data: members, refresh: reloadMembers } = await useFetch<
	APTypes.MemberSummary[]
>(`/api/server/${server.id}/members`, {
	headers: useRequestHeaders(["cookie"]),
});

const userCache = useUserCache();
for (const member of members.value) {
	userCache.value[member.profile.id] = {
		avatarUrl: member.profile.avatarUrl,
		username: member.profile.username,
	};
}

const addMemberId = ref("");
const addMemberError = ref("");
async function addMember() {
	if (addMemberId.value.length === 0) {
		addMemberError.value = "Missing Member ID";
		return;
	}
	if (!/^\d+$/.test(addMemberId.value)) {
		addMemberError.value = "Member ID may only contain digits";
		return;
	}
	try {
		await $fetch(`/api/server/${server.id}/member/${addMemberId.value}`, {
			method: "POST",
			headers: useRequestHeaders(["cookie"]),
		});
	} catch (e: unknown) {
		if (e instanceof FetchError) {
			addMemberError.value = e.message;
		}
		return;
	}
	const temp = addMemberId.value;
	addMemberId.value = "";
	addMemberError.value = "";
	await reloadMembers();
	const member = members.value.find((e) => e.profile.id === temp);
	if (member) {
		userCache.value[member.profile.id] = {
			avatarUrl: member.profile.avatarUrl,
			username: member.profile.username,
		};
	}
}

const memberDialogOpen = ref(false);
const memberDialogMember = ref("");
function viewMember(index: number) {
	memberDialogMember.value = members.value[index].profile.id;
	memberDialogOpen.value = true;
}
</script>
