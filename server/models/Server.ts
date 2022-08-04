import { createError } from "h3";
import pg from "pg";
import * as APTypes from "@/scripts/APTypes";

interface DbServer {
	id: string;
	owner_id: string;
	server_name: string;
	icon: string;
}

export default class Server {
	id: string;
	ownerId: string;
	serverName: string;
	icon: string;

	private constructor(
		id: string,
		ownerId: string,
		serverName: string,
		icon: string | null
	) {
		this.id = id;
		this.ownerId = ownerId;
		this.serverName = serverName;
		this.icon = icon;
	}

	static async create(
		pool: pg.Pool,
		id: string,
		ownerId: string,
		serverName: string,
		icon: string | null
	): Promise<Server | null> {
		if (!icon) icon = "";
		const client = await pool.connect();
		const serverQuery = {
			text:
				"INSERT INTO servers(id, owner_id, server_name, icon) " +
				"VALUES ($1, $2, $3, $4) " +
				"RETURNING *",
			values: [id, ownerId, serverName, icon],
		};
		const modQuery = {
			text:
				"INSERT INTO moderators(server_id, user_id, readonly) " +
				"VALUES ($1, $2, false)",
			values: [id, ownerId],
		};
		let result: pg.QueryResult;
		let insertError: pg.DatabaseError;
		let otherError: boolean;
		try {
			await client.query("BEGIN");
			result = await pool.query(serverQuery);
			await pool.query(modQuery);
			await client.query("COMMIT");
		} catch (e: unknown) {
			await client.query("ROLLBACK");
			if (e instanceof pg.DatabaseError) {
				insertError = e;
			} else {
				console.error(e);
				otherError = true;
			}
		} finally {
			client.release();
		}
		if (insertError) {
			if (insertError.constraint === "servers_pkey") {
				throw createError({
					statusCode: 400,
					statusMessage: "server already exists",
				});
			} else if (insertError.constraint === "servers_owner_id_fkey") {
				throw createError({
					statusCode: 404,
					statusMessage: "owner not found",
				});
			}
		} else if (otherError || result.rowCount < 1) {
			throw createError({
				statusCode: 500,
			});
		}
		const newServer = result.rows[0] as DbServer;

		return new Server(
			newServer.id,
			newServer.owner_id,
			newServer.server_name,
			newServer.icon
		);
	}

	static async fromId(pool: pg.Pool, id: string): Promise<Server | null> {
		const query = {
			text: "SELECT * FROM servers WHERE id = $1",
			values: [id],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			return null;
		}
		const foundServer = result.rows[0] as DbServer;
		return new Server(
			foundServer.id,
			foundServer.owner_id,
			foundServer.server_name,
			foundServer.icon
		);
	}

	static async findOwnedBy(pool: pg.Pool, userId: string): Promise<Server[]> {
		const query = {
			text: "SELECT * FROM servers WHERE owner_id = $1",
			values: [userId],
		};
		const result = await pool.query(query);
		return result.rows.map(
			(e: DbServer) => new Server(e.id, e.owner_id, e.server_name, e.icon)
		);
	}

	static async findAccessible(
		pool: pg.Pool,
		userId: string
	): Promise<Server[]> {
		const query = {
			text:
				"SELECT id, owner_id, server_name, icon " +
				"FROM servers JOIN moderators ON id = server_id " +
				"WHERE user_id = $1",
			values: [userId],
		};
		const result = await pool.query(query);
		return result.rows.map(
			(e: DbServer) => new Server(e.id, e.owner_id, e.server_name, e.icon)
		);
	}

	async userHasAccess(
		pool: pg.Pool,
		userId
	): Promise<"NONE" | "READONLY" | "FULL"> {
		const query = {
			text: "SELECT readonly FROM moderators WHERE server_id = $1 AND user_id = $2",
			values: [this.id, userId],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) return "NONE";
		else return result.rows[0].readonly ? "READONLY" : "FULL";
	}

	getIconUrl(): string {
		if (this.icon.length === 0) return "";
		return (
			`https://cdn.discordapp.com/icons/${this.id}/` +
			`${this.icon}${this.icon.startsWith("a_") ? ".gif" : ".png"}`
		);
	}

	toFullServer(): APTypes.Server {
		return {
			id: this.id,
			name: this.serverName,
			ownerId: this.ownerId,
			iconUrl: this.getIconUrl(),
		};
	}
}
