import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const id = searchParams.get("id");
  // const adtime = searchParams.get("adtime");
  // const starttime = searchParams.get("starttime");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const opcodeSql =`SELECT outpatient_code FROM outpatient where patient_number = ${id}`
  const { rows: opcode } = await pool.query(opcodeSql);
  
  if (opcode.length === 0) { // new patient
    const heighestOPSql = `
    SELECT MAX(CAST(SUBSTRING(outpatient_code FROM 3) AS INTEGER)) AS op_code
    FROM outpatient
    `
    const { rows: heighestID } = await pool.query(heighestOPSql);
    
    return Response.json({ state: "new", ip: "", maxip: heighestID[0].op_code }, { status: 200 });
  } 
    
  const IPcodeSql = `
  SELECT outpatient_code AS ip_code
  FROM outpatient
  WHERE patient_number = ${id};
  `
  const { rows: IPcode } = await pool.query(IPcodeSql);

  await pool.end();

  return Response.json({ state: "old", ip: IPcode[0].ip_code, maxip: 0 }, { status: 200 });
};







function isStartDateBeforeEndDate(startDateString: string, endDateString: string) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  return startDate <= endDate;
}

export async function POST(req: Request){
  const body = await req.json()
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const doctorSql =`
  SELECT code FROM doctor WHERE code = '${body.doctorcode}'
  `
  const { rows: doctors } = await pool.query(doctorSql);
  
  if (doctors.length === 0) 
    return Response.json({ res: "fail", warning: "Doctor code doesn't exist!" }, { status: 200 });

  if (!isStartDateBeforeEndDate(body.examtime, body.nextexamdate)) {
    return Response.json({ res: "fail", warning: "Exam timestamp is after Next exam date!" }, { status: 200 });
  }

  const checkValidSql =`
  SELECT * FROM examination WHERE patient_number = ${body.id} AND exam_timestamp = '${body.examtime}' AND	doctor_code = '${body.doctorcode}';
  `
  const { rows: checkValid } = await pool.query(checkValidSql);
  
  if (checkValid.length > 0) 
    return Response.json({ res: "fail", warning: "You already booked an examination at this time!" }, { status: 200 });


  // All valid

  const opcodeSql =`SELECT outpatient_code FROM outpatient where patient_number = ${body.id}`
  const { rows: opcode } = await pool.query(opcodeSql);
  
  if (opcode.length === 0) { // new patient
    const heighestOPSql = `
    INSERT INTO OutPatient(Patient_Number, Outpatient_Code)
    VALUES(
      ${body.id},
      '${body.opcode}'
    );
    `
    const { rows: heighestID } = await pool.query(heighestOPSql);
  } 


  const sql =`
  INSERT INTO Examination(Doctor_Code, Patient_Number, Outpatient_Code, Exam_Timestamp, Next_Exam_Date, Diagnosis, Fee)
  VALUES(
    '${body.doctorcode}',
    ${body.id},
    '${body.opcode}',
    '${body.examtime}',
    '${body.nextexamdate}',
    '${body.diagnosis}',
    ${body.fee}
  );
  `
  const { rows } = await pool.query(sql);

  await pool.end();

  return Response.json({ res: "success", warning: ""}, { status: 200 });
}