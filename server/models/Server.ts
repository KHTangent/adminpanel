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
		const query = {
			text:
				"INSERT INTO servers(id, owner_id, server_name, icon) " +
				"VALUES ($1, $2, $3, $4) " +
				"RETURNING *",
			values: [id, ownerId, serverName, icon],
		};
		let result: pg.QueryResult;
		try {
			result = await pool.query(query);
		} catch (e: unknown) {
			if (e instanceof pg.DatabaseError) {
				if (e.constraint === "servers_pkey") {
					throw createError({
						statusCode: 400,
						statusMessage: "server already exists",
					});
				} else if (e.constraint === "servers_owner_id_fkey") {
					throw createError({
						statusCode: 404,
						statusMessage: "owner not found",
					});
				}
			}
			console.error(e);
			throw createError({
				statusCode: 500,
			});
		}
		if (result.rowCount < 1) {
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

	getIconUrl(): string {
		if (this.icon.length === 0) return "";
		return (
			`https://cdn.discordapp.com/icons/${this.id}/` +
			`${this.icon}${this.icon.startsWith("a_") ? ".gif" : ".png"}`
		);
	}
}
