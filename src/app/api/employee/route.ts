import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const type = searchParams.get("type");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  if (type === 'd') {
    const sql =`
      SELECT code, concat(last_name, ' ', first_name) FROM doctor;
    `
    const { rows: doctor } = await pool.query(sql);
    return Response.json({ doctor, nurse: [] }, { status: 200 });

  }

  const sql =`
    SELECT code, concat(last_name, ' ', first_name) FROM nurse;
  `
  const { rows: nurse } = await pool.query(sql);

  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ doctor: [], nurse }, { status: 200 });
  
};
