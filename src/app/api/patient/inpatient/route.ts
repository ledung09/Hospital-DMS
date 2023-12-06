import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql1 =`
  SELECT
    a.*,
    tm.total_value
FROM
    admission a
LEFT JOIN (
    SELECT
        tm.patient_number,
        tm.admission_timestamp,
        SUM(tm.quantity * m.price) AS total_value
    FROM
        treatment_medication tm
    JOIN
        medication m ON tm.medication_code = m.code
    GROUP BY
        tm.patient_number,
        tm.admission_timestamp
) tm ON a.patient_number = tm.patient_number
    AND a.admission_timestamp = tm.admission_timestamp
WHERE
    a.patient_number = ${id};

  `
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
    m.price,
    m.price * tm.quantity AS total_value
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
  

  const sqlSum =`
  SELECT
    SUM(a.fee) AS total_fee,
    SUM(COALESCE(tm.total_value, 0)) AS total_value
FROM
    admission a
LEFT JOIN (
    SELECT
        tm.patient_number,
        tm.admission_timestamp,
        SUM(tm.quantity * m.price) AS total_value
    FROM
        treatment_medication tm
    JOIN
        medication m ON tm.medication_code = m.code
    GROUP BY
        tm.patient_number,
        tm.admission_timestamp
) tm ON a.patient_number = tm.patient_number
    AND a.admission_timestamp = tm.admission_timestamp
WHERE
    a.patient_number = ${id};
  `
  const { rows: sum } = await pool.query(sqlSum);

  
  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ admission, treatment, treatment_medication, sumtreatment: sum[0].total_fee , sumfee: sum[0].total_value }, { status: 200 });
  
};
