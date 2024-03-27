CREATE or replace FUNCTION get_patient_cost(p_no INTEGER) 
RETURNS TABLE (
    patient_number_ INT,
    outpatient_code CHAR(11),
    exam_doctor Char(10),
    exam_timestamp timestamp,
    exam_medication Char(10),
    exam_medication_unit_price INT,
    exam_medication_quantity INT,
    inpatient_code CHAR(11),
    treat_doctor char(10),
    admission_timestamp timestamp,
    treatment_start timestamp,
    treatment_medication Char(10),
    treatment_medication_unit_price INT,
    treatment_medication_quantity int,
    total_price int
)
language plpgsql
AS $$
declare
  examRow record;
  examCur cursor for(
    select * from Exam_Medication, Medication
    WHERE Patient_Number = p_no and Exam_Medication.Medication_Code = Medication.Code
  );
  treatRow record;
  treatCur cursor for(
    select * from Treatment_Medication, Medication
    WHERE Patient_Number = p_no and Treatment_Medication.Medication_Code = Medication.Code
  );
BEGIN
  open examCur;
  loop
    fetch examCur into examRow;
    exit when not found;
    patient_number_ := examRow.Patient_Number;
    outpatient_code := examRow.Outpatient_Code;
    exam_doctor := examRow.Doctor_Code;
    exam_timestamp := examRow.Exam_Timestamp;
    exam_medication := examRow.Medication_Code;
    exam_medication_unit_price := examRow.Price;
    exam_medication_quantity := examRow.Quantity;
    total_price := exam_medication_unit_price * exam_medication_quantity;
    inpatient_code := null;
    treat_doctor := null;
    admission_timestamp := null;
    treatment_start := null;
    treatment_medication := null;
    treatment_medication_unit_price := null;
    treatment_medication_quantity := null;
    return next; --insert a row into return table
  end loop;
  close examCur;

  open treatCur;
  loop
    fetch treatCur into treatRow;
    exit when not found;
    patient_number_ := treatRow.Patient_Number;
    inpatient_code := treatRow.Inpatient_Code;
    treat_doctor := treatRow.Doctor_Code;
    admission_timestamp := treatRow.Admission_Timestamp;
    treatment_start := treatRow.Start_Timestamp;
    treatment_medication := treatRow.Medication_Code;
    treatment_medication_unit_price := treatRow.Price;
    treatment_medication_quantity := treatRow.Quantity;
    total_price := treatment_medication_unit_price * treatment_medication_quantity;
    outpatient_code := null;
    exam_doctor := null;
    exam_timestamp := null;
    exam_medication := null;
    exam_medication_unit_price := null;
    exam_medication_quantity := null;
    return next; --insert a row into return table
  end loop;
  close treatCur;
END;
$$;

select * from get_patient_cost(2);