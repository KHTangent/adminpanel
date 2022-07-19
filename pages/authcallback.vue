<template>
	<v-container>
		<p class="text-body-1">
			{{ text }}
		</p>
		<v-row v-if="loaded">
			<v-col cols="6" class="d-flex flex-column">
				<v-img :src="imageUrl"> </v-img>
				<div>
					<h2 class="text-h3">
						Signed in as <strong>{{ username }}</strong>
					</h2>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
let text = ref("Signed in, redirecting...");
const route = useRoute();
const loaded = ref(false);
const imageUrl = ref("");
const username = ref("");

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
	const body: User = await $fetch("https://discord.com/api/v10/users/@me", {
		headers: {
			Authorization: `Bearer ${r.token}`,
		},
	});
	const localLoginCookie = useCookie("token", {
		maxAge: r.expiresIn,
		sameSite: "lax",
	});
	localLoginCookie.value = r.token;
	text.value = "";
	imageUrl.value = `https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png`;
	username.value = body.username;
	loaded.value = true;
});
</script>
