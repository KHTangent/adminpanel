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
					<MemberCard
						v-for="(member, i) in members"
						:key="i"
						:member="member.profile"
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
import * as APTypes from "@/scripts/APTypes";
import { dataToEsm } from "@rollup/pluginutils";

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
	APTypes.Member[]
>(`/api/server/${server.id}/members`, {
	headers: useRequestHeaders(["cookie"]),
});
</script>
