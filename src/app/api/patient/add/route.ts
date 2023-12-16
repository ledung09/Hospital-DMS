import { Pool } from "@neondatabase/serverless";

export const runtime = "edge"

function isWithin100Years(dateString: string): boolean {
  // Convert the input string to a Date object
  const inputDate = new Date(dateString);

  // Get the current date
  const currentDate = new Date();

  // Calculate the date before today
  const dateBeforeToday = new Date(currentDate);
  dateBeforeToday.setFullYear(currentDate.getFullYear() - 1);

  // Calculate the date 100 years ago from today
  const date100YearsAgo = new Date(currentDate);
  date100YearsAgo.setFullYear(currentDate.getFullYear() - 100);

  // Check if the input date is within the range
  return inputDate >= date100YearsAgo && inputDate <= dateBeforeToday;
}

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
      if (body.dob !== "") {
        if (!isWithin100Years(body.dob))
          return Response.json({ res: "fail", id: 1, warning: "Date of birth is invalid!" }, { status: 200 });
      }
      const sql =`
      INSERT INTO Patient(First_Name, Last_Name, Date_Of_Birth, Gender, Address, Phone_Number)
      VALUES(
        '${body.firstname}',
        '${body.lastname}',
        ${body.dob === "" ? null : `'${body.dob}'`},
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


      return Response.json({ res: "success", id: patient_id[0].patient_number, warning: "" }, { status: 200 });
    } else return Response.json({ res: "fail", id: phones[0].patient_number, warning: "This phone number is already existed in the database!" }, { status: 200 });
  } 

  var gender = (body.gender === 'male' ? 'M' : 'F');

  const sqlcheck =`
  SELECT * FROM patient where 
  first_name = '${body.firstname}' AND 
  last_name = '${body.lastname}' AND
  date_of_birth = '${body.dob}' AND
  gender = '${gender}' AND
  address = '${body.address}'
  ;
  `

  console.log(sqlcheck)

  const { rows: invalid } = await pool.query(sqlcheck);
  if (invalid.length > 0) {
    return Response.json({ res: "fail", id: invalid[0].patient_number, warning: "This patient is already existed in the database!" }, { status: 200 });
  }

  const sql =`
  INSERT INTO Patient(First_Name, Last_Name, Date_Of_Birth, Gender, Address, Phone_Number)
  VALUES(
    '${body.firstname}',
    '${body.lastname}',
    ${body.dob === "" ? null : `'${body.dob}'`},
    '${body.gender === 'male' ? 'M' : 'F'}',
    '${body.address}',
    '${body.phone}'
  );
  `;
  const { rows } = await pool.query(sql);

  const sql1 =`
  SELECT MAX(patient_number) AS highest_patient_number
  FROM patient;
  `
  const { rows:maxid } = await pool.query(sql1);

  await pool.end();

  return Response.json({ res: "success", id: maxid[0].highest_patient_number }, { status: 200 });

}