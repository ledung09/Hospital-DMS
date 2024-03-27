create table sort(doctor_code char(10), number_of_patients int);

create or replace PROCEDURE sort_doctor(startDate DATE, endDate DATE)
LANGUAGE plpgsql
AS $$
DECLARE
    doctorRow record;
    doctorCur cursor(startDate DATE, endDate DATE) for(
      select dcode, count(*) as numP from(
        (
          select doctor.code as dcode, patient.patient_number as pnum, examination.exam_timestamp as visit
          from doctor, examination, patient
          where doctor.code = examination.doctor_code and patient.patient_number = examination.patient_number
          and examination.exam_timestamp >= (startDate + time '00:00:00')
          and examination.exam_timestamp <= (endDate + time '23:59:59')
        )
        union
        (
          select doctor.code as dcode, patient.patient_number as pnum, treatment.admission_timestamp as visit
          from doctor, treatment, patient
          where doctor.code = treatment.doctor_code and patient.patient_number = treatment.patient_number
          and treatment.admission_timestamp >= (startDate + time '00:00:00')
          and treatment.admission_timestamp <= (endDate + time '23:59:59')
        )
      ) as SortDoc
      group by dcode
      order by count(*) ASC
    );
begin
  delete from sort;
  open doctorCur(startDate DATE, endDate DATE);
  loop
    fetch doctorCur into doctorRow;
    exit when not found;
    insert into sort(doctor_code, number_of_patients) values (doctorRow.dcode, doctorRow.numP);
  end loop;
  close doctorCur;
end; 
$$;

call sort_doctor('2023-01-01', '2023-12-01');

select * from sort;