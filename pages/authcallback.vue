<template>
	<v-container>
		<p class="text-body-1">
			{{ text }}
		</p>
	</v-container>
</template>

<script lang="ts" setup>
let text = ref("Signed in, redirecting...");
const route = useRoute();

onMounted(async () => {
	if (!route.query["code"]) {
		text.value = "Invalid login, please try again";
		return;
	}
	let r: { token: string; expiresIn: number };
	try {
		r = await $fetch("/api/auth/login", {
			method: "POST",
			body: {
				code: route.query["code"],
			},
		});
	} catch (e) {
		console.log(e);
		text.value = e.text;
		return;
	}
	const body = await $fetch("https://discord.com/api/v10/users/@me", {
		headers: {
			Authorization: `Bearer ${r.token}`,
		},
	});
	const localLoginCookie = useCookie("token", {
		maxAge: r.expiresIn,
		sameSite: "lax",
	});
	localLoginCookie.value = r.token;
	text.value = JSON.stringify(body);
});
</script>
