'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { doctorInfo } from "@/types/interface"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { HiDocumentText } from "react-icons/hi";

export default function Page() {
  const [idInput, setIdInput] = useState<string>('')
  const [res, setRes] = useState<doctorInfo[]>([])

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2 my-5">
        <Input type="text" placeholder="Doctor ID" onChange={(e) => {setIdInput(e.target.value)}} value={idInput}/>
        <Button type="button" onClick={
          async () => {
            // const response = await fetch('/api', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({ name, due, prior, des })
            // });
            // const { tasks } = await response.json();
            const response = await fetch(`/api/doctor?id=${idInput}`);
            const { doctor } = await response.json();
            setRes(doctor)
          }
        }>
          Search</Button>
      </div>  
      <Table>
        
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
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
            <TableHead className="text-center">View detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            res && res.map((row, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{ row.code }</TableCell>
                  <TableCell>{ row.first_name }</TableCell>
                  <TableCell>{ row.last_name }</TableCell>
                  <TableCell>{ formatDate(row.date_of_birth) }</TableCell>
                  <TableCell>{ row.gender }</TableCell>
                  <TableCell>{ row.address }</TableCell>
                  <TableCell>{ formatDate(row.start_date) }</TableCell>
                  <TableCell>{ row.specialty_name }</TableCell>
                  <TableCell>{ row.degree_year }</TableCell>
                  <TableCell>{ formatDate(row.end_date) }</TableCell>
                  <TableCell>{ row.is_working ? "Yes" : "No" }</TableCell>
                  <TableCell>{ row.dept_code }</TableCell>
                  <TableCell>
                    <Link href={ `/patients/info?id=${row.code}` } >
                      <HiDocumentText className="text-black mx-auto text-lg font-semibold"/>
                    </Link>
                  </TableCell>
                </TableRow>
                // </Link>
              )
            })
          }
          
        </TableBody>
      </Table>

    </>
  )
}