import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const sql =`
    SELECT * FROM doctor where code = '${id}'
    OR CONCAT(last_name, ' ', first_name) ILIKE '${id}' 
  `
  const { rows: doctor } = await pool.query(sql);

  const treatmentSql =`
  SELECT
    T.*,
    P.First_Name,
    P.Last_Name
  FROM
      Treatment AS T
  JOIN
      Patient AS P ON T.Patient_Number = P.Patient_Number
  WHERE
      T.Doctor_Code = '${id}';
  `
  const { rows: treatments } = await pool.query(treatmentSql);

  const examinationSql =`
  SELECT
    E.*,
    P.First_Name,
    P.Last_Name
  FROM
      Examination AS E
  JOIN
      Patient AS P ON E.Patient_Number = P.Patient_Number
  WHERE
      E.Doctor_Code = '${id}';
  `
  const { rows: examinations } = await pool.query(examinationSql);


  await pool.end();

  // return Response.json({ hello: now }, {status : 200});

  return Response.json({ doctor, treatments, examinations }, { status: 200 });
  
};
