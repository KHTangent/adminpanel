import { createError } from "h3";
import pg from "pg";
import * as APTypes from "@/scripts/APTypes";
import Note from "@/server/models/Note";

interface DbMember {
	server_id: string;
	user_id: string;
	username: string;
	avatar: string;
}

export default class Member {
	userId: string;
	serverId: string;
	username: string;
	avatar: string;

	private constructor(
		userId: string,
		serverId: string,
		username: string,
		avatar: string
	) {
		this.userId = userId;
		this.serverId = serverId;
		this.username = username;
		this.avatar = avatar;
	}

	static async create(
		pool: pg.Pool,
		userId: string,
		serverId: string,
		username: string,
		avatar: string | null
	): Promise<Member> {
		if (!avatar) avatar = "";
		const query = {
			text:
				"INSERT INTO server_members (server_id, user_id, username, avatar) " +
				"VALUES ($1, $2, $3, $4) " +
				"RETURNING *",
			values: [serverId, userId, username, avatar],
		};
		let result: pg.QueryResult;
		try {
			result = await pool.query(query);
		} catch (e: unknown) {
			if (e instanceof pg.DatabaseError) {
				if (e.constraint === "server_members_server_id_user_id_key") {
					throw createError({
						statusCode: 400,
						statusMessage: "Member exists",
					});
				} else if (e.constraint === "server_members_server_id_fkey") {
					throw createError({
						statusCode: 404,
						statusMessage: "Server not found",
					});
				}
			}
			console.error(e);
			throw createError({
				statusCode: 500,
			});
		}
		if (result.rowCount < 1) {
			console.error("Creating user returned 0 rows");
			throw createError({
				statusCode: 500,
			});
		}
		const foundMember = result.rows[0] as DbMember;
		return new Member(
			foundMember.user_id,
			foundMember.server_id,
			foundMember.username,
			foundMember.avatar
		);
	}

	static async getAll(pool: pg.Pool, serverId: string): Promise<Member[]> {
		const query = {
			text: "SELECT * FROM server_members WHERE server_id = $1",
			values: [serverId],
		};
		const result = await pool.query(query);
		return result.rows.map(
			(r: DbMember) => new Member(r.user_id, r.server_id, r.username, r.avatar)
		);
	}

	static async get(
		pool: pg.Pool,
		serverId: string,
		userId: string
	): Promise<Member | null> {
		const query = {
			text: "SELECT * FROM server_members WHERE server_id = $1 AND user_id = $2",
			values: [serverId, userId],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			return null;
		}
		const member = result.rows[0] as DbMember;
		return new Member(
			member.user_id,
			member.server_id,
			member.username,
			member.avatar
		);
	}

	async addNote(
		pool: pg.Pool,
		title: string,
		type: APTypes.NoteType,
		body: string,
		createdBy: string,
		resolved = false,
		expires?: Date
	): Promise<Note> {
		return await Note.create(
			pool,
			this.serverId,
			this.userId,
			title,
			type,
			body,
			createdBy,
			resolved,
			expires
		);
	}

	async getNotes(pool: pg.Pool): Promise<Note[]> {
		return await Note.findAll(pool, this.serverId, this.userId);
	}

	getAvatarURL(): string {
		if (this.avatar.length === 0) return "";
		if (this.avatar.startsWith("a_")) {
			return `https://cdn.discordapp.com/avatars/${this.userId}/${this.avatar}.gif`;
		} else {
			return `https://cdn.discordapp.com/avatars/${this.userId}/${this.avatar}.png`;
		}
	}

	toMemberSummary(): APTypes.MemberSummary {
		return {
			serverId: this.serverId,
			profile: {
				avatarUrl: this.getAvatarURL(),
				id: this.userId,
				username: this.username,
			},
		};
	}

	async toFullMember(pool: pg.Pool): Promise<APTypes.MemberWithNotes> {
		const notes = await this.getNotes(pool);
		return {
			serverId: this.serverId,
			profile: {
				avatarUrl: this.getAvatarURL(),
				id: this.userId,
				username: this.username,
			},
			notes: notes.map((e) => e.toFullNote()),
		};
	}
}
