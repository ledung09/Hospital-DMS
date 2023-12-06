import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

// export const GET = async (req: Request) => {
//   const { searchParams } = new URL(req.url);
  
//   const pid = searchParams.get("pid");
//   const adtime = searchParams.get("adtime");
//   const starttime = searchParams.get("starttime");

//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });

//   const sql1 =`SELECT * FROM treatment_medication where patient_number = ${pid} AND 	admission_timestamp = ${pid}`
//   const { rows: admission } = await pool.query(sql1);

//   const sql2 =`SELECT * FROM treatment where patient_number = ${id}`
//   const { rows: treatment } = await pool.query(sql2);

//   const sql3 =`SELECT medication_code, quantity FROM treatment_medication where patient_number = ${id}`
//   const { rows: treatment_medication } = await pool.query(sql3);
  

//   // if (id) {
//   //   sql = `SELECT * FROM patient WHERE patient_number = ${id}`;

//   // } else {
//   //   sql = `SELECT * FROM patient WHERE phone_number = '${phone}'`;
//   // }

//   // const { rows } = await pool.query(sql1);

//   // const now = rows[0];
  
//   await pool.end();

//   // return Response.json({ hello: now }, {status : 200});

//   return Response.json({ admission, treatment, treatment_medication }, { status: 200 });
  
// };

  // const pool = new Pool({
  //   connectionString: process.env.DATABASE_URL,
  // });

  // const sql1 =`SELECT * FROM treatment_medication where patient_number = ${body.pid} AND admission_timestamp = '${body.adtime}' AND start_timestamp = '${body.starttime}'`
  // const { rows } = await pool.query(sql1);

  // await pool.end();

export async function POST(req: Request){
  const body = await req.json()
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql1 =`SELECT * FROM treatment_medication where patient_number = ${body.pid} AND admission_timestamp = '${body.adtime}' AND start_timestamp = '${body.starttime}'`
  const { rows } = await pool.query(sql1);

  await pool.end();
  return Response.json({ tasks: body }, { status: 200 });

}