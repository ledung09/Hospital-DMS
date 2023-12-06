import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql1 =`SELECT * FROM admission where patient_number = ${id}`
  const { rows: admission } = await pool.query(sql1);

  const sql2 =`
  SELECT
    *
  FROM
    treatment t
  JOIN
    admission a ON t.inpatient_code = a.inpatient_code
                  AND t.admission_timestamp = a.admission_timestamp
  WHERE
    a.patient_number = ${id};`
  const { rows: treatment } = await pool.query(sql2);

  const sql3 =`
  SELECT
    tm.quantity,
    tm.start_timestamp,
    tm.admission_timestamp,
    m.code,
    m.name_,
    m.price
  FROM
      (
          SELECT
              t.inpatient_code,
              t.admission_timestamp,
              t.doctor_code,
              t.start_timestamp,
              t.end_timestamp,
              t.result_,
              tm.medication_code,
              tm.quantity
          FROM
              treatment t
          JOIN
              admission a ON t.inpatient_code = a.inpatient_code
                            AND t.admission_timestamp = a.admission_timestamp
          JOIN
              treatment_medication tm ON t.inpatient_code = tm.inpatient_code
                                      AND t.admission_timestamp = tm.admission_timestamp
                                      AND t.start_timestamp = tm.start_timestamp
          WHERE
              a.patient_number = ${id}
      ) tm
  JOIN
      medication m ON tm.medication_code = m.code;
  `
  const { rows: treatment_medication } = await pool.query(sql3);
  

  // if (id) {
  //   sql = `SELECT * FROM patient WHERE patient_number = ${id}`;

  // } else {
  //   sql = `SELECT * FROM patient WHERE phone_number = '${phone}'`;
  // }

  // const { rows } = await pool.query(sql1);

  // const now = rows[0];
  
  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ admission, treatment, treatment_medication }, { status: 200 });
  
};
