<template>
	<v-container>
		<h1 class="text-h1">My servers</h1>
		<p class="text-body-1">Here you can see servers you've been added to.</p>
		<v-row class="my-4">
			<v-col cols="12">
				<div class="d-flex justify-start">
					<v-btn
						big
						to="/servers/create"
						color="success"
						:prepend-icon="icons.mdiPlus"
					>
						Add new
					</v-btn>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import { mdiPlus } from "@mdi/js";

const icons = {
	mdiPlus,
};
</script>
