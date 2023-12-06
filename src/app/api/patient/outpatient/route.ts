import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql =`SELECT * FROM examination where patient_number = ${id}`
  const { rows: examination } = await pool.query(sql);


  const sql1 =`
  SELECT
    em.*,
    m.name_,
    m.price,
    em.quantity * m.price AS total_value
  FROM
    exam_medication em
  JOIN
    medication m ON em.medication_code = m.code
  WHERE
    em.patient_number = ${id};
  `
  const { rows: exam_medication } = await pool.query(sql1);

  const sql2 =`
  SELECT
    SUM(em.quantity * m.price) AS total_value
FROM
    exam_medication em
JOIN
    medication m ON em.medication_code = m.code
WHERE
    em.patient_number = ${id};

  `
  const { rows: sumexammed } = await pool.query(sql2);

  
  const sql3 =`
  SELECT
  SUM(fee) AS total_fee
FROM
  examination
WHERE
  patient_number = ${id};
  `
  const { rows: sumexam } = await pool.query(sql3);
  

  // if (id) {
  //   sql = `SELECT * FROM patient WHERE patient_number = ${id}`;

  // } else {
  //   sql = `SELECT * FROM patient WHERE phone_number = '${phone}'`;
  // }

  // const { rows } = await pool.query(sql1);

  // const now = rows[0];
  
  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ examination, exam_medication, sumexam: sumexam[0].total_fee, sumexammed: sumexammed[0].total_value }, { status: 200 });
  
};
