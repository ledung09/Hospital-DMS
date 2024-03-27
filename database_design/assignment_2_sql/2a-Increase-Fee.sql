UPDATE Admission 
SET Fee = Fee * 1.1
WHERE Discharge_Timestamp IS NULL 
    AND Recovered = FALSE
    AND Admission_Timestamp >= '2020-09-01 00:00:00';