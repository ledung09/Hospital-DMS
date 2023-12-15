import { Pool } from "@neondatabase/serverless";

export const runtime = "edge";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  // const adtime = searchParams.get("adtime");
  // const starttime = searchParams.get("starttime");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const IPcodeSql = `
  SELECT inpatient_code AS ip_code
  FROM inpatient
  WHERE patient_number = ${id};
  `;
  const { rows: IPcode } = await pool.query(IPcodeSql);

  await pool.end();

  return Response.json({ ip: IPcode[0].ip_code }, { status: 200 });
};

function isStartDateBeforeEndDate( startDateString: string,  endDateString: string) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  return startDate <= endDate;
}

export async function POST(req: Request) {
  const body = await req.json();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const doctorSql = `
  SELECT code FROM doctor WHERE code = '${body.doctorcode}'
  `;
  const { rows: doctors } = await pool.query(doctorSql);

  if (doctors.length === 0)
    return Response.json(
      { res: "fail", warning: "Doctor code doesn't exist!" },
      { status: 200 }
    );

  if (body.starttime !== "" && !isStartDateBeforeEndDate(body.admissiontime, body.starttime)) {
    return Response.json(
      { res: "fail", warning: "Admission timestamp is after Start timestamp!" },
      { status: 200 }
    );
  }

  if (body.starttime !== "" && body.endtime !== "" && !isStartDateBeforeEndDate(body.starttime, body.endtime)) {
    return Response.json(
      { res: "fail", warning: "Start timestamp is after End timestamp!" },
      { status: 200 }
    );
  }

  const checkValidSql = `
  SELECT * FROM treatment WHERE patient_number = ${body.id} 
  AND admission_timestamp = '${body.admissiontime}' AND start_timestamp = '${body.starttime}' AND doctor_code = '${body.doctorcode}';
  `;
  const { rows: checkValid } = await pool.query(checkValidSql);

  if (checkValid.length > 0)
    return Response.json(
      { res: "fail", warning: "You already booked a treatment at this time!" },
      { status: 200 }
    );

  // const sql =`
  // INSERT INTO Admission(Patient_Number, Inpatient_Code, Admission_Timestamp, Nurse_Code, Diagnosis, Sick_Room, Recovered, Fee, Discharge_Timestamp)
  // VALUES(
  //   ${body.id},
  //   '${body.ipcode}',
  //   '${body.admissiontime}',
  //   '${body.nursecode}',
  //   '${body.diagnosis}',
  //   '${body.sickroom}',
  //   '${body.recovered === 'yes' ? 'TRUE': 'FALSE'}',
  //   '${body.fee}',
  //   '${body.dischargetime}'
  // );
  // `

  const sql = `
  INSERT INTO Treatment(Doctor_Code, Patient_Number, Inpatient_Code, Admission_Timestamp, Start_Timestamp, End_Timestamp, Result_)
  VALUES(
    '${body.doctorcode}',
    ${body.id},
    '${body.ip}',
    '${body.admissiontime}',
    ${body.starttime === "" ? null : `'${body.starttime}'`},
    ${body.endtime === "" ? null : `'${body.endtime}'`},
    '${body.result}'
  );
  `;
  const { rows } = await pool.query(sql);

  await pool.end();

  return Response.json({ res: "success", warning: "" }, { status: 200 });
}
