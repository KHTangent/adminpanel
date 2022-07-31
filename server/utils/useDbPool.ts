import { CompatibilityEvent } from "h3";
import pg from "pg";

let pool: pg.Pool;

/**
 * Gets a reference to the global database connection pool. Establishes a new connection if it
 * does not exist yet, and performs migrations
 * @param e Event from the H3 handler
 */
export default async function useDbPool(
	e: CompatibilityEvent
): Promise<pg.Pool> {
	if (!pool) {
		pool = new pg.Pool();
		const client = await pool.connect();
		client.release();
	}
	return pool;
}
