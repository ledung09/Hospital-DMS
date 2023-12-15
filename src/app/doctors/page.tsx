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
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"


const formSchema = z.object({
  search: z.string().min(1, {
    message: "*Do not leave empty!"
  }).max(50, {
    message: "*Maximum 50 characters!"
  }),
});


export default function Page() {
  const router = useRouter()
  const { toast } = useToast()

  const [idInput, setIdInput] = useState<string>('')
  const [res, setRes] = useState<doctorInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchEmpty, setSearchEmpty] = useState<boolean>(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: ""
    },
  });

  return (
    <>
    <Form {...form}>
        <form
          className="my-5 flex space-x-2 max-w-2xl"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormControl>
                  <Input placeholder="Doctor ID / Doctor name " {...field}  onChange={(e) => {setIdInput(e.target.value)}} value={idInput}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              setRes([])
              setSearchEmpty(false)
              
              if (idInput.trim() === '') {
                return;
              }

              setLoading(true);

              const response = await fetch(`/api/doctor?id=${idInput}`);
              const { doctor } = await response.json();
              
              setLoading(false);
              setRes(doctor)

              if (doctor.length === 0) {
                toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: "Can't find any doctor with that ID!",
                  action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
                setSearchEmpty(true);
              }
            }}
          >
            Search
          </Button>
          
        </form>
      </Form>
      <Table>
        {
          searchEmpty &&
          <TableCaption>
            No record of this doctor in the database!
          </TableCaption>
        }
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Firstname</TableHead>
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
          {
            loading &&
            <TableRow>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
              <TableCell><Skeleton className="h-5  w-full" /></TableCell>
            </TableRow>
          }
          {
            res && res.map((row, idx) => {
              return (
                <TableRow key={idx} className="cursor-pointer" onClick={()=>router.push(`/doctors/info?code=${row.code}`)}>
                  <TableCell className="font-medium">{ row.code }</TableCell>
                  <TableCell>{ row.last_name }</TableCell>
                  <TableCell>{ row.first_name }</TableCell>
                  <TableCell>{ formatDate(row.date_of_birth) }</TableCell>
                  <TableCell>{ row.gender }</TableCell>
                  <TableCell>{ row.address }</TableCell>
                  <TableCell>{ formatDate(row.start_date) }</TableCell>
                  <TableCell>{ row.specialty_name }</TableCell>
                  <TableCell>{ row.degree_year }</TableCell>
                  <TableCell>{ formatDate(row.end_date) }</TableCell>
                  <TableCell>{ row.is_working ? "Yes" : "No" }</TableCell>
                  <TableCell>{ row.dept_code }</TableCell>
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