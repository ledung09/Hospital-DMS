"use client";

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
  doctorInfo
} from "@/types/interface";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const id = searchParams.get("code");

  const [info, setInfo] = useState<doctorInfo | undefined>(undefined);
  const [admission, setAdmission] = useState<admission[]>([]);
  const [treatment, setTreatment] = useState<treatment[]>([]);
  const [examination, setExamination] = useState<examination[]>([]);

  const [treatmentMedication, setTreatmentMedication] = useState<treatment_medication[]>([]);

  useEffect(() => {
    const getInfo = async () => {
      if (id) {
        console.log("aaa")
        const response = await fetch(`/api/doctor?id=${id}`);
        const { doctor: info, treatments, examinations } = await response.json();
        setInfo(info ? info[0] : undefined);
        setTreatment(treatments);
        setExamination(examinations);


      } else {
        setInfo(undefined);
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
          <CardTitle>Doctor information</CardTitle>
          <CardDescription>{id ? `Doctor code = ${id}` : ""}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Firstname</TableHead>
                <TableHead>Lastname</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>Speciality name</TableHead>
                <TableHead>Degree year</TableHead>
                <TableHead>End date</TableHead>
                <TableHead>Working</TableHead>
                <TableHead>Department code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {info ? (
                <TableRow>
                  <TableCell className="font-medium">
                    {info.code}
                  </TableCell>
                  <TableCell>{info.first_name}</TableCell>
                  <TableCell>{info.last_name}</TableCell>
                  <TableCell>{formatDate(info.date_of_birth)}</TableCell>
                  <TableCell>{info.gender}</TableCell>
                  <TableCell>{info.address}</TableCell>
                  <TableCell>{formatDate(info.start_date)}</TableCell>
                  <TableCell>{info.specialty_name}</TableCell>
                  <TableCell>{info.degree_year}</TableCell>
                  <TableCell>{formatDate(info.end_date)}</TableCell>
                  <TableCell>{info.is_working ? "Yes" : "No"}</TableCell>
                  <TableCell>{info.dept_code}</TableCell>


                  

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
        <CardTitle>Admission list</CardTitle>
          <CardDescription>{id ? `Doctor code = ${id}` : ""}</CardDescription>
          </CardHeader>
        <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient number</TableHead>
                        <TableHead>Inpatient code</TableHead>
                        <TableHead>Admission timestamp</TableHead>
                        <TableHead>Start timestamp</TableHead>
                        <TableHead>End timestamp</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
          {treatment &&
            treatment.map((row, idx) => {
              return (
                      <TableRow className="cursor-pointer" key={idx} onClick={() => router.push(`/patients/info?id=${row.patient_number}`)}>
                        <TableCell className="font-medium"> {row.patient_number}</TableCell>
                        <TableCell>{row.inpatient_code}</TableCell>
                        <TableCell> {formatDateTime(row.admission_timestamp)}</TableCell>
                        <TableCell>{formatDateTime(row.start_timestamp)}</TableCell>
                        <TableCell>{formatDateTime(row.end_timestamp)}</TableCell>
                        <TableCell>{row.result_}</TableCell>
                      </TableRow>
                    );
                  })}
                    </TableBody>
                  </Table>
        </CardContent>
      </Card>

    
      <Card className="my-8">
        <CardHeader>
        <CardTitle>Examination list</CardTitle>
          <CardDescription>{id ? `Doctor code = ${id}` : ""}</CardDescription>
          </CardHeader>
        <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient number</TableHead>
                        <TableHead>Outpatient code</TableHead>
                        <TableHead>Exam timestamp</TableHead>
                        <TableHead>Next exam date</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
          {examination &&
            examination.map((row, idx) => {
              return (
                      <TableRow className="cursor-pointer" key={idx} onClick={() => router.push(`/patients/info?id=${row.patient_number}`)}>
                        <TableCell className="font-medium"> {row.patient_number}</TableCell>
                        <TableCell>{row.outpatient_code}</TableCell>
                        <TableCell> {formatDateTime(row.exam_timestamp)}</TableCell>
                        <TableCell>{formatDate(row.next_exam_date)}</TableCell>
                        <TableCell>{row.diagnosis}</TableCell>
                        <TableCell>{row.fee}</TableCell>
                      </TableRow>
                    );
                  })}
                    </TableBody>
                  </Table>
        </CardContent>
      </Card>
    </>
  );
}
