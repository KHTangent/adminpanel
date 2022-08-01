import { createError } from "h3";
import pg from "pg";
import * as APTypes from "@/scripts/APTypes";

interface DbUser {
	id: string;
	username: string;
	avatar: string;
}

export default class User {
	id: string;
	username: string;
	avatar: string;
	private token: string;

	private constructor(id: string, username: string, avatar: string) {
		this.id = id;
		this.username = username;
		this.avatar = avatar;
		this.token = "";
	}

	static async create(
		pool: pg.Pool,
		id: string,
		username: string,
		avatar: string | null
	): Promise<User | null> {
		if (!avatar) avatar = "";
		const query = {
			text:
				"INSERT INTO users (id, username, avatar) " +
				"VALUES ($1, $2, $3) " +
				"RETURNING *",
			values: [id, username, avatar],
		};
		let result: pg.QueryResult;
		try {
			result = await pool.query(query);
		} catch (e: unknown) {
			if (e instanceof pg.DatabaseError) {
				if (e.constraint === "users_id_key") {
					return null;
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
		const foundUser = result.rows[0] as DbUser;
		return new User(foundUser.id, foundUser.username, foundUser.avatar);
	}

	static async fromId(pool: pg.Pool, id: string): Promise<User | null> {
		const query = {
			text: "SELECT id, username, avatar FROM users WHERE id = $1",
			values: [id],
		};
		let rows = await pool.query(query);
		if (rows.rowCount < 1) return null;
		const foundUser = rows.rows[0] as DbUser;
		return new User(foundUser.id, foundUser.username, foundUser.avatar);
	}

	static async fromToken(pool: pg.Pool, token: string): Promise<User | null> {
		const query = {
			text:
				"SELECT id, username, avatar, expires " +
				"FROM users JOIN user_tokens ON id = user_id " +
				"WHERE token = $1",
			values: [token],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			return null;
		}
		if (new Date() > result.rows[0].expires) {
			return null;
		}
		const foundUser = result.rows[0] as DbUser;
		const user = new User(foundUser.id, foundUser.username, foundUser.avatar);
		user.storeToken(token);
		return user;
	}

	async addToken(pool: pg.Pool, token: string, expires: Date) {
		const query = {
			text:
				"INSERT INTO user_tokens(token, user_id, expires) " +
				"VALUES ($1, $2, $3)",
			values: [token, this.id, expires],
		};
		try {
			await pool.query(query);
			this.storeToken(token);
		} catch (e) {
			if (e instanceof pg.DatabaseError) {
				if (e.constraint == "user_tokens_pkey") {
					return;
				}
			}
			console.error(e);
			throw createError({
				statusCode: 500,
			});
		}
	}

	private storeToken(token: string) {
		this.token = token;
	}

	getToken(): string {
		if (this.token.length === 0) {
			throw createError({
				statusCode: 401,
			});
		}
		return this.token;
	}

	getAvatarURL(): string {
		if (this.avatar.startsWith("a_")) {
			return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.gif`;
		} else {
			return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
		}
	}

	toJSON(): DbUser {
		return {
			id: this.id,
			username: this.username,
			avatar: this.avatar,
		};
	}

	toFullUser(): APTypes.Profile {
		return {
			id: this.id,
			username: this.username,
			avatarUrl: this.getAvatarURL(),
		};
	}
}
