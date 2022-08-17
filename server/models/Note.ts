import { createError } from "h3";
import pg from "pg";
import * as APTypes from "@/scripts/APTypes";

interface DbNote {
	id: string;
	server_id: string;
	user_id: string;
	title: string;
	note_type: APTypes.NoteType;
	body: string;
	created_at: Date;
	created_by: string;
	resolved: boolean;
	expires?: Date;
}

export default class Note {
	noteId: string;
	serverId: string;
	userId: string;
	title: string;
	noteType: APTypes.NoteType;
	body: string;
	createdAt: Date;
	createdBy: string;
	resolved: boolean;
	expires?: Date;

	private constructor(
		noteId: string,
		serverId: string,
		userId: string,
		title: string,
		noteType: APTypes.NoteType,
		body: string,
		createdAt: Date,
		createdBy: string,
		resolved: boolean,
		expires?: Date
	) {
		this.noteId = noteId;
		this.serverId = serverId;
		this.userId = userId;
		this.title = title;
		this.noteType = noteType;
		this.body = body;
		this.createdAt = createdAt;
		this.createdBy = createdBy;
		this.resolved = resolved;
		this.expires = expires;
	}

	static async create(
		pool: pg.Pool,
		serverId: string,
		userId: string,
		title: string,
		noteType: APTypes.NoteType,
		body: string,
		createdBy: string,
		resolved = false,
		expires?: Date
	): Promise<Note> {
		if (!expires) expires = null;
		const query = {
			text:
				"INSERT INTO member_notes(server_id, user_id, title, note_type, body, created_by, resolved, expires) " +
				"VALUES ($1, $2, $3, $4, $5, $6, $7, $8) " +
				"RETURNING *",
			values: [
				serverId,
				userId,
				title,
				noteType,
				body,
				createdBy,
				resolved,
				expires,
			],
		};
		let result: pg.QueryResult;
		try {
			result = await pool.query(query);
		} catch (e: unknown) {
			if (e instanceof pg.DatabaseError) {
				if (e.constraint === "member_notes_server_id_fkey") {
					throw createError({
						statusCode: 404,
						statusMessage: "Server not found",
					});
				} else if (e.constraint === "member_notes_created_by_fkey") {
					throw createError({
						statusCode: 404,
						statusMessage: "Note owner not found",
					});
				}
			}
			console.error(e);
			throw createError({
				statusCode: 500,
			});
		}
		if (result.rowCount < 1) {
			console.error("Creating note returned 0 rows");
			throw createError({
				statusCode: 500,
			});
		}
		const foundNote = result.rows[0] as DbNote;
		return new Note(
			foundNote.id,
			foundNote.server_id,
			foundNote.user_id,
			foundNote.title,
			foundNote.note_type,
			foundNote.body,
			foundNote.created_at,
			foundNote.created_by,
			foundNote.resolved,
			foundNote.expires
		);
	}

	static async fromId(pool: pg.Pool, id: string): Promise<Note | null> {
		let query = {
			text: "SELECT * FROM member_notes WHERE id = $1",
			values: [id],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			return null;
		}
		const foundNote = result.rows[0] as DbNote;
		return new Note(
			foundNote.id,
			foundNote.server_id,
			foundNote.user_id,
			foundNote.title,
			foundNote.note_type,
			foundNote.body,
			foundNote.created_at,
			foundNote.created_by,
			foundNote.resolved,
			foundNote.expires
		);
	}

	static async findAll(
		pool: pg.Pool,
		serverId: string,
		memberId?: string
	): Promise<Note[]> {
		let query: pg.QueryConfig;
		if (memberId) {
			query = {
				text: "SELECT * FROM member_notes WHERE server_id = $1 AND user_id = $2",
				values: [serverId, memberId],
			};
		} else {
			query = {
				text: "SELECT * FROM member_notes WHERE server_id = $1",
				values: [serverId],
			};
		}
		const result = await pool.query(query);
		return result.rows.map(
			(e: DbNote) =>
				new Note(
					e.id,
					e.server_id,
					e.user_id,
					e.title,
					e.note_type,
					e.body,
					e.created_at,
					e.created_by,
					e.resolved,
					e.expires
				)
		);
	}

	async resolve(pool: pg.Pool) {
		if (this.resolved) return;
		const query = {
			text: "UPDATE member_notes SET resolved = true WHERE id = $1",
			values: [this.noteId],
		};
		await pool.query(query);
		this.resolved = true;
	}

	toFullNote(): APTypes.Note {
		return {
			noteId: this.noteId,
			serverId: this.serverId,
			userId: this.userId,
			title: this.title,
			noteType: this.noteType,
			body: this.body,
			createdAt: this.createdAt,
			createdBy: this.createdBy,
			resolved: this.resolved,
			expires: this.expires || null,
		};
	}
}
