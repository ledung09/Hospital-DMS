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
import { patientProfile } from "@/types/interface"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { HiDocumentText } from "react-icons/hi";

export default function Page() {
  const [phoneInput, setPhoneInput] = useState<string>('')
  const [res, setRes] = useState<patientProfile[]>([])

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2 my-5">
        <Input type="text" placeholder="Patient phone number/ Patient name" onChange={(e) => {setPhoneInput(e.target.value)}} value={phoneInput}/>
        <Button 
          type="button"
          onClick={async () => {
            // Check if phoneInput is empty
            if (phoneInput.trim() === '') {
              // If phoneInput is empty, do nothing
              return;
            }
        
            // If phoneInput is not empty, proceed with the API call
            const response = await fetch(`/api/patient?phone=${phoneInput.trim()}`);
            const { res } = await response.json();
            console.log(res);
            setRes(res);
          }}
        >
          Search</Button>
      </div>  
      <Table>
        
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
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
            res && res.map((data, idx) => {
              return (
                <TableRow className="cursor-pointer" key={idx} onClick={() => {window.location.href = `/patients/info?id=${data.patient_number}`}}>
                  <TableCell className="font-medium">{data.patient_number}</TableCell>
                  <TableCell>{data.first_name}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>{formatDate(data.date_of_birth)}</TableCell>
                  <TableCell>{data.gender}</TableCell>
                  <TableCell>{data.address}</TableCell>
                  <TableCell>{data.phone_number}</TableCell>
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