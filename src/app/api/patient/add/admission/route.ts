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

  const ipcodeSql =`SELECT inpatient_code FROM inpatient where patient_number = ${id}`
  const { rows: ipcode } = await pool.query(ipcodeSql);
  
  if (ipcode.length === 0) { // new patient
    const heighestIPSql = `
    SELECT MAX(CAST(SUBSTRING(inpatient_code FROM 3) AS INTEGER)) AS ip_code
    FROM inpatient
    `
    const { rows: heighestID } = await pool.query(heighestIPSql);
    
    return Response.json({ state: "new", ip: "", maxip: heighestID[0].ip_code }, { status: 200 });

  } 
    
  const IPcodeSql = `
  SELECT inpatient_code AS ip_code
  FROM inpatient
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

  const nurseSql =`
  SELECT code FROM nurse WHERE code = '${body.nursecode}'
  `
  const { rows: nurses } = await pool.query(nurseSql);
  
  if (nurses.length === 0) 
    return Response.json({ res: "fail", warning: "Nurse code doesn't exist!" }, { status: 200 });

  if (!isStartDateBeforeEndDate(body.admissiontime, body.dischargetime)) {
    return Response.json({ res: "fail", warning: "Admission timestamp is after Discharge timestamp!" }, { status: 200 });
  }

  const checkValidSql =`
  SELECT * FROM admission WHERE patient_number = ${body.id} AND admission_timestamp = '${body.admissiontime}';
  `
  const { rows: checkValid } = await pool.query(checkValidSql);
  
  if (checkValid.length > 0) 
    return Response.json({ res: "fail", warning: "You already booked an admission at this time!" }, { status: 200 });

// All valid

  const ipcodeSql =`SELECT inpatient_code FROM inpatient where patient_number = ${body.id}`
  const { rows: ipcode } = await pool.query(ipcodeSql);

  if (ipcode.length === 0) { // new patient
    const heighestIPSql = `
    INSERT INTO Inpatient(Patient_Number, Inpatient_Code)
    VALUES(
      ${body.id},
      '${body.ipcode}'
    );
    `
    const { rows: heighestID } = await pool.query(heighestIPSql);
    
    return Response.json({ state: "new", ip: "", maxip: heighestID[0].ip_code }, { status: 200 });

  } 


  const sql =`
  INSERT INTO Admission(Patient_Number, Inpatient_Code, Admission_Timestamp, Nurse_Code, Diagnosis, Sick_Room, Recovered, Fee, Discharge_Timestamp)
  VALUES(
    ${body.id},
    '${body.ipcode}',
    '${body.admissiontime}',
    '${body.nursecode}',
    '${body.diagnosis}',
    '${body.sickroom}',
    '${body.recovered === 'yes' ? 'TRUE': 'FALSE'}',
    '${body.fee}',
    '${body.dischargetime}'
  );
  `
  const { rows } = await pool.query(sql);

  await pool.end();

  return Response.json({ res: "success", warning: ""}, { status: 200 });
}