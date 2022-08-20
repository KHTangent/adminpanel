import useLogin from "@/server/utils/useLogin";
import useDbPool from "@/server/utils/useDbPool";
import Server from "@/server/models/Server";
import Member from "@/server/models/Member";
import * as APTypes from "@/scripts/APTypes";
import { validateDate } from "@/scripts/Tools";

export default defineEventHandler(async (e) => {
	const user = await useLogin(e);
	const pool = await useDbPool(e);
	const serverId = e.context.params.sid as string;
	const memberId = e.context.params.mid as string;
	const body = await useBody<APTypes.CreateNoteRequest>(e);

	// First, verify body
	if (!body.body || !body.noteType || !body.title) {
		throw createError({
			statusCode: 400,
			statusMessage: "Missing fields",
		});
	}
	if (!Object.values(APTypes.NoteType).includes(body.noteType)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid note type",
		});
	}
	const hasExpiryDate = !!(body.expires && body.expires.length !== 0);
	if (hasExpiryDate) {
		const dateError = validateDate(body.expires);
		if (dateError.length !== 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid expirity date: " + dateError,
			});
		}
	}

	// Check existance of server, and permissions
	const server = await Server.fromId(pool, serverId);
	if (!server) {
		throw createError({
			statusCode: 404,
			statusMessage: "Server not found",
		});
	}
	const accessMode = await server.userHasAccess(pool, user.id);
	if (accessMode !== "FULL") {
		throw createError({
			statusCode: 403,
			statusMessage: "You don't have write access to this server",
		});
	}
	const member = await Member.get(pool, server.id, memberId);
	if (!member) {
		throw createError({
			statusCode: 404,
			statusMessage: "Member not found in server",
		});
	}
	let expiryDate: Date;
	if (hasExpiryDate) {
		// We know this is valid, because we've already checked the input structure
		const [day, month, year] = body.expires.split("-").map((e) => parseInt(e));
		expiryDate = new Date(year, month - 1, day);
	}
	const note = await member.addNote(
		pool,
		body.title,
		body.noteType,
		body.body,
		user.id,
		hasExpiryDate,
		expiryDate
	);
	return note.toFullNote();
});
