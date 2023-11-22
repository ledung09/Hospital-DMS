import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql = `SELECT * FROM playing_with_neon`;

  const { rows } = await pool.query(sql);

  const now = rows[0];
  
  await pool.end();

  return Response.json({ hello: now }, {status : 200});
};
