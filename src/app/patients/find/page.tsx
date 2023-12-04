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

interface patientProfile {
  address: string;
  date_of_birth: string;
  first_name: string;
  gender: string;
  last_name: string
  patient_number: number
  phone_number: string;
}

function formatDate(inputString: string) {
  const date = new Date(inputString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}
 
export default function page() {
  const [phoneInput, setPhoneInput] = useState<string>('')
  const [res, setRes] = useState<patientProfile[]>([])

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2 my-5">
        <Input type="text" placeholder="Patient phone number" onChange={(e) => {setPhoneInput(e.target.value)}} value={phoneInput}/>
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
            const response = await fetch(`/api/patient?phone=${phoneInput}`);
            const { res } = await response.json();
            console.log(res)
            setRes(res)
          }
        }>
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
            res && res.map((data) => {
              return (
                <TableRow>
                  <TableCell className="font-medium">{data.patient_number}</TableCell>
                  <TableCell>{data.first_name}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>{formatDate(data.date_of_birth)}</TableCell>
                  <TableCell>{data.gender}</TableCell>
                  <TableCell>{data.address}</TableCell>
                  <TableCell>{data.phone_number}</TableCell>
                </TableRow>
              )
            })
          }
          
        </TableBody>
      </Table>

    </>
  )
}