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
    sql = `
    PREPARE select_patient AS
      SELECT * FROM patient WHERE patient_number = $1;
    EXECUTE select_patient(${id});
  `;

  } else {
    if (phone) {
      sql = `
      SELECT * FROM patient WHERE phone_number = '${phone}'
      `;
    }
  }

  const { rows } = await pool.query(sql);

  const now = rows[0];
  
  await pool.end();

  return Response.json({ tasks: now}, { status: 200 });
  
};
