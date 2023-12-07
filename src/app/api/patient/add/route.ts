import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export async function POST(req: Request){
  const body = await req.json()
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });


  if (body.phone !== "") {
    const checkphoneSql = `
      SELECT * FROM patient WHERE phone_number = '${body.phone}'
    `
    const { rows: phones } = await pool.query(checkphoneSql);
    if (phones.length === 0) {
      const sql =`
      INSERT INTO Patient(First_Name, Last_Name, Date_Of_Birth, Gender, Address, Phone_Number)
      VALUES(
        '${body.firstname}',
        '${body.lastname}',
        '${body.dob}',
        '${body.gender === 'male' ? 'M' : 'F'}',
        '${body.address}',
        '${body.phone}'
      );
      `
      const { rows } = await pool.query(sql);

      const sql1 =`
      SELECT patient_number FROM patient WHERE phone_number = '${body.phone}'
      `
      const { rows: patient_id } = await pool.query(sql1);


      return Response.json({ res: "success", id: patient_id[0].patient_number }, { status: 200 });
    } else return Response.json({ res: "fail", id: phones[0].patient_number }, { status: 200 });
  } 


  const sql =`
  INSERT INTO Patient(First_Name, Last_Name, Date_Of_Birth, Gender, Address, Phone_Number)
  VALUES(
    '${body.firstname}',
    '${body.lastname}',
    '${body.dob}',
    '${body.gender === 'male' ? 'M' : 'F'}',
    '${body.address}',
    '${body.phone}'
  );
  `
  const { rows } = await pool.query(sql);

  const sql1 =`
  SELECT MAX(patient_number) AS highest_patient_number
  FROM patient;
  `
  const { rows:maxid } = await pool.query(sql1);

  await pool.end();

  return Response.json({ res: "success", id: maxid[0].highest_patient_number }, { status: 200 });

}