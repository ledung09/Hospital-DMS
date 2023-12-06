"use client";

import { Terminal } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  patientProfile,
  admission,
  treatment,
  examination,
  treatment_medication,
  exam_medication
} from "@/types/interface";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [info, setInfo] = useState<patientProfile | undefined>(undefined);
  const [admission, setAdmission] = useState<admission[]>([]);
  const [treatment, setTreatment] = useState<treatment[]>([]);
  const [examination, setExamination] = useState<examination[]>([]);

  const [treatmentMedication, setTreatmentMedication] = useState<treatment_medication[]>([]);
  const [examMedication, setExamMedication] = useState<exam_medication[]>([]);


  const [sumTreatment, setSumTreatment] = useState<number | null>(0)
  const [sumFee, setSumFee] = useState<number | null>(0)

  const [sumExam, setSumExam] = useState<number | null>(0)
  const [sumExamMed, setSumExamMed] = useState<number | null>(0)


  useEffect(() => {
    const getInfo = async () => {
      if (id) {
        const response = await fetch(`/api/patient?id=${id}`);
        const { res: info } = await response.json();
        setInfo(info ? info[0] : undefined);

        const response1 = await fetch(`/api/patient/inpatient?id=${id}`);
        const { admission, treatment, treatment_medication, sumtreatment, sumfee } = await response1.json();
        
        setAdmission(admission);
        setTreatment(treatment);
        setTreatmentMedication(treatment_medication);
        setSumTreatment(sumtreatment);
        setSumFee(sumfee);




        const response2 = await fetch(`/api/patient/outpatient?id=${id}`);
        const { examination, exam_medication, sumexam, sumexammed } = await response2.json();
        setExamination(examination);
        setExamMedication(exam_medication)
        setSumExam(sumexam)
        setSumExamMed(sumexammed)
        
      } else {
        setInfo(undefined);
        setAdmission([]);
        setTreatment([]);
        setExamination([]);
      }
    };
    getInfo();
  }, []);

  return (
    <>
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Patient information</CardTitle>
          <CardDescription>{id ? `Patient id = ${id}` : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient number</TableHead>
                <TableHead>Firstname</TableHead>
                <TableHead>Lastname</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {info ? (
                <TableRow>
                  <TableCell className="font-medium">
                    {info.patient_number}
                  </TableCell>
                  <TableCell>{info.first_name}</TableCell>
                  <TableCell>{info.last_name}</TableCell>
                  <TableCell>{formatDate(info.date_of_birth)}</TableCell>
                  <TableCell>{info.gender}</TableCell>
                  <TableCell>{info.address}</TableCell>
                  <TableCell>{info.phone_number}</TableCell>
                </TableRow>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="my-8">
        <CardHeader>
          <div className="flex justify-between items-center w-100">
            <div className="flex-col">
              <CardTitle>Admission information</CardTitle>
              <CardDescription className="mt-1.5">{id ? `Patient id = ${id}` : ""}</CardDescription>
            </div>
            <Button variant='default' onClick={() =>{
              router.push(`/patients/add/admission?id=${id}`)
            }}>Add Admission</Button>
          </div>
        </CardHeader>
        <CardContent>
          {admission &&
            admission.map((row, idx) => {
              return (
                <div className="border-4 mb-8 px-2 rounded-lg" key={idx}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient number</TableHead>
                        <TableHead>Inpatient code</TableHead>
                        <TableHead>Admission timestamp</TableHead>
                        <TableHead>Nurse code</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Sickroom</TableHead>
                        <TableHead>Recovered</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Discharge timestamp</TableHead>
                        <TableHead>Total treatment cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium"> {row.patient_number}</TableCell>
                        <TableCell>{row.inpatient_code}</TableCell>
                        <TableCell> {formatDateTime(row.admission_timestamp)}</TableCell>
                        <TableCell>{row.nurse_code}</TableCell>
                        <TableCell>{row.diagnosis}</TableCell>
                        <TableCell>{row.sick_room}</TableCell>
                        <TableCell>{row.recovered ? "Yes" : "No"}</TableCell>
                        <TableCell>{row.fee}</TableCell>
                        <TableCell>{formatDateTime(row.discharge_timestamp)}</TableCell>
                        <TableCell>{row.total_value}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Accordion type="single" collapsible className="px-2">
                    <AccordionItem value="item-1" className="border-none">
                      <AccordionTrigger className="py-3 justify-start gap-x-1.5">
                        Treatments information
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Doctor code</TableHead>
                              <TableHead>Patient number</TableHead>
                              <TableHead>Inpatient code</TableHead>
                              <TableHead>Admission timestamp</TableHead>
                              <TableHead>Start timestamp</TableHead>
                              <TableHead>End timestamp</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>Medication</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {treatment &&
                              treatment.map((treatment_row, key) => {
                                return (
                                  row.admission_timestamp === treatment_row.admission_timestamp && 
                                  (
                                    <TableRow key={key}>
                                      <TableCell className="font-medium">{treatment_row.doctor_code}</TableCell>
                                      <TableCell>{treatment_row.patient_number}</TableCell>
                                      <TableCell>{treatment_row.inpatient_code}</TableCell>
                                      <TableCell>{formatDateTime(treatment_row.admission_timestamp)}</TableCell>
                                      <TableCell>{formatDateTime(treatment_row.start_timestamp)}</TableCell>
                                      <TableCell>{formatDateTime(treatment_row.end_timestamp)}</TableCell>
                                      <TableCell>{treatment_row.result_}</TableCell>
                                      <TableCell>
                                        <Sheet>
                                          <SheetTrigger>
                                            {/* <Button 
                                              variant="default" 
                                              // onClick={async() => {
                                              //   const response = await fetch('/api/medication/treatment', {
                                              //     method: 'POST',
                                              //     headers: {
                                              //       'Content-Type': 'application/json',
                                              //     },
                                              //     body: JSON.stringify({ 
                                              //       pid: treatment_row.patient_number,
                                              //       adtime: treatment_row.admission_timestamp,
                                              //       starttime: treatment_row.start_timestamp
                                              //     })
                                              //   });
                                              //   const { tasks } = await response.json();
                                              //   console.log(tasks)
                                              // }}
                                            >
                                              
                                            </Button> */}
                                            Open
                                          </SheetTrigger>
                                          <SheetContent side="top">
                                            <SheetHeader>
                                              <SheetTitle>Treatment medication list</SheetTitle>
                                              <SheetDescription>
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Medication code</TableHead>
                                                      <TableHead>Medication name</TableHead>
                                                      <TableHead>Medication price (per item)</TableHead>
                                                      <TableHead>Medication quantity</TableHead>
                                                      <TableHead>Total price</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {
                                                      treatmentMedication &&
                                                      treatmentMedication.map((treatment_med_row, idx) => {
                                                        // console.log(treat_med_row)
                                                        return (
                                                          treatment_row.admission_timestamp === treatment_med_row.admission_timestamp && 
                                                          treatment_row.start_timestamp === treatment_med_row.start_timestamp && 
                                                          (
                                                            <TableRow key={idx}>
                                                              <TableCell className="font-medium">{treatment_med_row.code}</TableCell>
                                                              <TableCell>{treatment_med_row.name_}</TableCell>
                                                              <TableCell>{treatment_med_row.price}</TableCell>
                                                              <TableCell>{treatment_med_row.quantity}</TableCell>
                                                              <TableCell>{treatment_med_row.total_value}</TableCell>


                                                              
                                                              {/* <TableCell>{row.patient_number}</TableCell>
                                                              <TableCell>{row.outpatient_code}</TableCell>
                                                              <TableCell>
                                                                {formatDateTime(row.exam_timestamp)}
                                                              </TableCell>
                                                              <TableCell>{formatDate(row.next_exam_date)}</TableCell>
                                                              <TableCell>{row.diagnosis}</TableCell>
                                                              <TableCell>{row.fee}</TableCell> */}
                                                            </TableRow>
                                                          )
                                                        );
                                                      })}
                                                  </TableBody>
                                                </Table>
                                              </SheetDescription>
                                            </SheetHeader>
                                            <SheetFooter>
                                                  <SheetClose asChild>
                                                    <Button type="submit" size="sm" className="mt-8">Close</Button>
                                                  </SheetClose>
                                                </SheetFooter>
                                          </SheetContent>
                                        </Sheet>
                                      </TableCell>
                                    </TableRow>
                                  )
                                );
                              })}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Button 
                    variant='default' 
                    size="sm" 
                    className="mt-2 mx-2"
                    onClick={() => {
                      router.push(`/patients/add/treatment?id=${id}&admissiontime=${row.admission_timestamp}`)
                    }}
                  >Add treatment</Button>

                  <Alert className="my-5 mt-8">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>
                      <p className="font-semibold">Treatment(s) cost: <span className="font-normal">{row.total_value === null ? 0 : row.total_value}</span></p>
                    </AlertTitle>
                    <AlertTitle className="mt-4">
                      <p className="font-semibold">Admission fee cost: <span className="font-normal">{row.fee === null ? 0 : row.fee}</span></p>
                    </AlertTitle>
                    <AlertTitle className="mt-4">
                      <p className="font-semibold">Sum cost: <span className="font-normal">{`${parseInt(row.total_value === null ? '0' : row.total_value.toString()) + parseInt(row.fee === null ? '0' : row.fee.toString())}`}</span></p>
                    </AlertTitle>
                  </Alert>



                </div>
              );
            })}

<Alert className="my-5 mt-8 border-red-500">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>
                      <p className="font-semibold">Total treatments cost: <span className="font-normal">{sumTreatment === null ? 0 : sumTreatment}</span></p>
                    </AlertTitle>
                    <AlertTitle className="mt-4">
                      <p className="font-semibold">Total admission fee: <span className="font-normal">{sumFee === null ? 0: sumFee}</span></p>
                    </AlertTitle>
                    <AlertTitle className="mt-4">
                      <p className="font-semibold">Total admission cost: <span className="font-normal">{`${parseInt(sumTreatment === null ? '0' : sumTreatment.toString()) + parseInt(sumFee === null ? '0' : sumFee.toString())}`}</span></p>
                    </AlertTitle>
                  </Alert>
        </CardContent>
      </Card>

    
      <Card className="my-8">
        <CardHeader>
          <div className="flex justify-between items-center w-100">
            <div className="flex-col">
              <CardTitle>Examination information</CardTitle>
              <CardDescription className="mt-1.5">{id ? `Patient id = ${id}` : ""}</CardDescription>
            </div>
            <Button variant='default' onClick={()=> {
              router.push(`/patients/add/examination?id=${id}`)
            }}>Add Examination</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor code</TableHead>
                <TableHead>Patient number</TableHead>
                <TableHead>Outpatient code</TableHead>
                <TableHead>Exam timestamp</TableHead>
                <TableHead>Next exam timestamp</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Medication</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examination &&
                examination.map((row, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {row.doctor_code}
                      </TableCell>
                      <TableCell>{row.patient_number}</TableCell>
                      <TableCell>{row.outpatient_code}</TableCell>
                      <TableCell>
                        {formatDateTime(row.exam_timestamp)}
                      </TableCell>
                      <TableCell>{formatDate(row.next_exam_date)}</TableCell>
                      <TableCell>{row.diagnosis}</TableCell>
                      <TableCell>{row.fee}</TableCell>
                      <TableCell>
                      <Sheet>
                                          <SheetTrigger>
                                            {/* <Button 
                                              variant="default" 
                                              // onClick={async() => {
                                              //   const response = await fetch('/api/medication/treatment', {
                                              //     method: 'POST',
                                              //     headers: {
                                              //       'Content-Type': 'application/json',
                                              //     },
                                              //     body: JSON.stringify({ 
                                              //       pid: treatment_row.patient_number,
                                              //       adtime: treatment_row.admission_timestamp,
                                              //       starttime: treatment_row.start_timestamp
                                              //     })
                                              //   });
                                              //   const { tasks } = await response.json();
                                              //   console.log(tasks)
                                              // }}
                                            >
                                              
                                            </Button> */}
                                            Open
                                          </SheetTrigger>
                                          <SheetContent side="top">
                                            <SheetHeader>
                                              <SheetTitle>Examination medication list</SheetTitle>
                                              <SheetDescription>
                                                <Table>
                                                  <TableHeader>
                                                    <TableRow>
                                                      <TableHead>Medication code</TableHead>
                                                      <TableHead>Medication name</TableHead>
                                                      <TableHead>Medication price (per item)</TableHead>
                                                      <TableHead>Medication quantity</TableHead>
                                                      <TableHead>Total price</TableHead>
                                                    </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                    {
                                                      examMedication &&
                                                      examMedication.map((exam_med_row, idx) => {
                                                        // console.log(treat_med_row)
                                                        return (
                                                          row.doctor_code === exam_med_row.doctor_code && 
                                                          row.exam_timestamp === exam_med_row.exam_timestamp && 
                                                          (
                                                            <TableRow key={idx}>
                                                              <TableCell className="font-medium">{exam_med_row.medication_code}</TableCell>
                                                              <TableCell>{exam_med_row.name_}</TableCell>
                                                              <TableCell>{exam_med_row.price}</TableCell>
                                                              <TableCell>{exam_med_row.quantity}</TableCell>
                                                              <TableCell>{exam_med_row.total_value}</TableCell>


                                                              

                                                            </TableRow>
                                                          )
                                                        );
                                                      })}
                                                  </TableBody>
                                                </Table>
                                              </SheetDescription>
                                            </SheetHeader>
                                            <SheetFooter>
                                                  <SheetClose asChild>
                                                    <Button type="submit" size="sm" className="mt-8">Close</Button>
                                                  </SheetClose>
                                                </SheetFooter>
                                          </SheetContent>
                                        </Sheet>


                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <Alert className="my-5 mt-8 border-red-500">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>
                      <p className="font-semibold">Total medicines cost: <span className="font-normal">{sumExamMed === null ? 0 : sumExamMed}</span></p>
                    </AlertTitle>
                    <AlertTitle className="mt-4">
                      <p className="font-semibold">Total examination fee: <span className="font-normal">{sumExam === null ? 0: sumExam}</span></p>
                    </AlertTitle>
                    <AlertTitle className="mt-4">
                      <p className="font-semibold">Total examination cost: <span className="font-normal">{`${parseInt(sumExamMed === null ? '0' : sumExamMed.toString()) + parseInt(sumExam === null ? '0' : sumExam.toString())}`}</span></p>
                    </AlertTitle>
                  </Alert>
        </CardContent>
      </Card>
    </>
  );
}
