import useDbPool from "../data/db";

export default defineEventHandler(async (e) => {
	await useDbPool(e);
});
