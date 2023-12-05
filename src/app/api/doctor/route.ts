import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql =`SELECT * FROM doctor where code = '${id}'`
  const { rows: doctor } = await pool.query(sql);

  
  

  // if (id) {
  //   sql = `SELECT * FROM patient WHERE patient_number = ${id}`;

  // } else {
  //   sql = `SELECT * FROM patient WHERE phone_number = '${phone}'`;
  // }

  // const { rows } = await pool.query(sql1);

  // const now = rows[0];
  
  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ doctor }, { status: 200 });
  
};
