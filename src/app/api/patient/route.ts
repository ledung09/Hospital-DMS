import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const phone = searchParams.get("phone");
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  var sql = "";

  if (id) {
    sql = `SELECT * FROM patient WHERE patient_number = ${id}`;

  } else {
    sql = `SELECT * FROM patient WHERE phone_number = '${phone}'
    OR CONCAT(last_name, ' ', first_name) ILIKE '${phone}' `;
  }

  const { rows } = await pool.query(sql);

  // const now = rows[0];
  
  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ res: rows}, { status: 200 });
  
};
