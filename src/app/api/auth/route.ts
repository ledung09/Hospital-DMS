import { Pool } from "@neondatabase/serverless";

export const runtime = "edge";

export const GET = async (req: Request) => {
  return Response.json({ res: "aaa"}, { status: 200 });
  
};


export async function POST(req: Request) {
  const body = await req.json();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql = `
  SELECT * FROM dba_account
  WHERE username = '${body.username}' AND password = crypt('${body.password}', password);
  `;
  const { rows } = await pool.query(sql);

  if (rows.length > 0) return Response.json({ res: true }, { status: 200 });

  await pool.end();

  return Response.json({ res: false }, { status: 200 });
}
