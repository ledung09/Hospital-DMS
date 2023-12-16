export interface patientProfile {
  address: string;
  date_of_birth: string;
  first_name: string;
  gender: string;
  last_name: string;
  patient_number: number;
  phone_number: string;
}

export interface admission {
  patient_number: number;
  inpatient_code: string;
  admission_timestamp: string;
  nurse_code: string;
  diagnosis: string;
  sick_room: string;
  recovered: boolean;
  fee: number | null;
  discharge_timestamp: string;
  total_value: number | null;
  total_fee: number;
}

export interface treatment {
  doctor_code: string;
  patient_number: number;
  inpatient_code: string;
  admission_timestamp: string;
  start_timestamp: string;
  end_timestamp: string;
  result_: string;
  last_name?: string;
  first_name?: string;
}

export interface treatment_medication extends treatment {
  code: string;
  name_: string;
  price: number;
  quantity: number;
  total_value: number;
}

export interface examination {
  doctor_code: string;
  patient_number: number;
  outpatient_code: string;
  exam_timestamp: string;
  next_exam_date: string;
  diagnosis: string;
  fee: number;
  last_name?: string;
  first_name?: string;
}

export interface exam_medication extends examination {
  medication_code: string;
  quantity: number;
  name_: string;
  price: number;
  total_value: number;
}

export interface doctorInfo {
  code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  start_date: string;
  specialty_name: string;
  degree_year: number;
  end_date: string | null;
  is_working: boolean;
  dept_code: string;
}


