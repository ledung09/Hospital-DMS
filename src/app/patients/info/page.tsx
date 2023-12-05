'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { patientProfile, admission, treatment, examination } from "@/types/interface"
import { formatDate, formatDateTime } from "@/lib/utils"
import { useSearchParams } from "next/navigation"


export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [info, setInfo] = useState<patientProfile | undefined>(undefined)
  const [admission, setAdmission] = useState<admission[]>([])
  const [treatment, setTreatment] = useState<treatment[]>([])
  const [examination, setExamination] = useState<examination[]>([])
  
  useEffect(() => {
    const getInfo = async () => {
      if (id) {
        const response = await fetch(`/api/patient?id=${id}`);
        const { res: info } = await response.json();
        setInfo(info ? info[0] : undefined)

        const response1 = await fetch(`/api/patient/inpatient?id=${id}`);
        const { admission, treatment } = await response1.json();
        setAdmission(admission);
        setTreatment(treatment)

        const response2 = await fetch(`/api/patient/outpatient?id=${id}`);
        const { examination } = await response2.json();
        setExamination(examination)
      } else {
        setInfo(undefined)
        setAdmission([])
        setTreatment([])
        setExamination([])
      }
    };
    getInfo();
  }, []);

  return (
    <>
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Patient information</CardTitle>
          <CardDescription>
            {id ? `Patient id = ${id}`:""}
          </CardDescription>
        </CardHeader>
        <CardContent>
         
          <Table >
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
            {
            info ?
              <TableRow>
                <TableCell className="font-medium">{ info.patient_number }</TableCell>
                <TableCell>{ info.first_name }</TableCell>
                <TableCell>{ info.last_name }</TableCell>
                <TableCell>{ formatDate(info.date_of_birth) }</TableCell>
                <TableCell>{ info.gender }</TableCell>
                <TableCell>{ info.address }</TableCell>
                <TableCell>{ info.phone_number }</TableCell>
              </TableRow>
              : 
              <></>
            } 
            </TableBody>
          </Table>
          
        </CardContent>
      </Card>
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Admission information</CardTitle>
          <CardDescription>
            {id ? `Patient id = ${id}`:""}
          </CardDescription>
        </CardHeader>
        <CardContent>
        {
          admission && admission.map((row, idx) => {
            return (
            <div className="border mb-4 px-2 rounded-lg" key={idx}>
              <Table >
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{ row.patient_number }</TableCell>
                    <TableCell>{ row.inpatient_code }</TableCell>
                    <TableCell>{ formatDateTime(row.admission_timestamp) }</TableCell>
                    <TableCell>{ row.nurse_code }</TableCell>
                    <TableCell>{ row.diagnosis }</TableCell>
                    <TableCell>{ row.sick_room}</TableCell>
                    <TableCell>{ row.recovered ? "Yes" : "No" }</TableCell>
                    <TableCell>{ row.fee }</TableCell>
                    <TableCell>{ formatDateTime(row.discharge_timestamp) }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Accordion type="single" collapsible className="px-2">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="py-3 justify-start gap-x-1.5">Treatment information</AccordionTrigger>
                  <AccordionContent>
                    <Table >
                      <TableHeader>
                        <TableRow>
                          <TableHead>Doctor code</TableHead>
                          <TableHead>Patient number</TableHead>
                          <TableHead>Inpatient code</TableHead>
                          <TableHead>Admission timestamp</TableHead>
                          <TableHead>Start timestamp</TableHead>
                          <TableHead>End timestamp</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {
                        treatment && treatment.map((treatment_row, key) => {
                          return (
                            row.patient_number === treatment_row.patient_number && 
                              row.inpatient_code === treatment_row.inpatient_code &&
                              row.admission_timestamp === treatment_row.admission_timestamp
                            && 
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{ treatment_row.doctor_code }</TableCell>
                                <TableCell>{ treatment_row.patient_number }</TableCell>
                                <TableCell>{ treatment_row.inpatient_code }</TableCell>
                                <TableCell>{ formatDateTime(treatment_row.admission_timestamp) }</TableCell>
                                <TableCell>{ formatDateTime(treatment_row.start_timestamp) }</TableCell>
                                <TableCell>{ formatDateTime(treatment_row.end_timestamp) }</TableCell>
                                <TableCell>{ treatment_row.result_ }</TableCell>
                              </TableRow>
                          )
                        })
                      } 
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            )
          })
        } 
        </CardContent>
      </Card>

      {/* <Card className="my-8">
        <CardHeader>
          <CardTitle>Treatment information</CardTitle>
          <CardDescription>
            {id ? `Patient id = ${id}`:""}
          </CardDescription>
        </CardHeader>
        <CardContent>
         
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead>Doctor code</TableHead>
                <TableHead>Patient number</TableHead>
                <TableHead>Inpatient code</TableHead>
                <TableHead>Admission timestamp</TableHead>
                <TableHead>Start timestamp</TableHead>
                <TableHead>End timestamp</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
            treatment && treatment.map((row) => {
              return (
                <TableRow>
                  <TableCell className="font-medium">{ row.doctor_code }</TableCell>
                  <TableCell>{ row.patient_number }</TableCell>
                  <TableCell>{ row.inpatient_code }</TableCell>
                  <TableCell>{ formatDateTime(row.admission_timestamp) }</TableCell>
                  <TableCell>{ formatDateTime(row.start_timestamp) }</TableCell>
                  <TableCell>{ formatDateTime(row.end_timestamp) }</TableCell>
                  <TableCell>{ row.result_ }</TableCell>
                </TableRow>
              )
            })
            } 
            </TableBody>
          </Table>
          
        </CardContent>
      </Card> */}


      <Card className="my-8">
        <CardHeader>
          <CardTitle>Examination information</CardTitle>
          <CardDescription>
            {id ? `Patient id = ${id}`:""}
          </CardDescription>
        </CardHeader>
        <CardContent>
         
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead>Doctor code</TableHead>
                <TableHead>Patient number</TableHead>
                <TableHead>Outpatient code</TableHead>
                <TableHead>Exam timestamp</TableHead>
                <TableHead>Next exam timestamp</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
            examination && examination.map((row, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{ row.doctor_code }</TableCell>
                  <TableCell>{ row.patient_number }</TableCell>
                  <TableCell>{ row.outpatient_code }</TableCell>
                  <TableCell>{ formatDateTime(row.exam_timestamp) }</TableCell>
                  <TableCell>{ formatDate(row.next_exam_date) }</TableCell>
                  <TableCell>{ row.diagnosis }</TableCell>
                  <TableCell>{ row.fee }</TableCell>
                </TableRow>
              )
            })
            } 
            </TableBody>
          </Table>
          
        </CardContent>
      </Card>
    </>
  )
}
