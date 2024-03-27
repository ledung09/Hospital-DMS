SELECT Patient.patient_number, first_name, last_name, date_of_birth, gender, Address, Phone_Number,
outpatient.outpatient_code, inpatient.inpatient_code
FROM Patient 
left outer join outpatient on Patient.patient_number = outpatient.patient_number
left outer join inpatient on Patient.patient_number = inpatient.patient_number
WHERE Patient.patient_number in(
	select patient_number
	from treatment
	where doctor_code in(
		select code
		from doctor
		where last_name ='Nguyen Van' and first_name = 'A'
	)
	union
	select patient_number
	from examination
	where doctor_code in(
		select code
		from doctor
		where last_name ='Nguyen Van' and first_name = 'A'
	)
)
;