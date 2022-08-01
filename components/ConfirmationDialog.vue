<template>
	<v-dialog max-width="1280px" v-model="modelValue" @click:outside="close">
		<v-card>
			<v-card-text>
				<h3 v-if="title.length > 0" class="text-h3 mb-2">{{ title }}</h3>
				<slot />
			</v-card-text>
			<v-card-actions>
				<v-btn plain @click="close">Cancel</v-btn>
				<v-btn color="error" @click="confirm">Confirm</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
defineProps({
	modelValue: {
		default: false,
		type: Boolean,
	},
	title: {
		default: "",
		type: String,
	},
});
const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

function close() {
	emit("cancel");
	emit("update:modelValue", false);
}

function confirm() {
	emit("confirm");
	emit("update:modelValue", false);
}
</script>
