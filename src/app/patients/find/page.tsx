'use client'

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useRef, useState } from "react"
import { patientProfile } from "@/types/interface"
import { formatDate } from "@/lib/utils"
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

const formSchema = z.object({
  search: z.string().min(1, {
    message: "*Do not leave empty!"
  }).max(50, {
    message: "*Maximum 50 characters!"
  }),
});


export default function Page() {
  const { toast } = useToast()

  const [phoneInput, setPhoneInput] = useState<string>('')
  const [res, setRes] = useState<patientProfile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchEmpty, setSearchEmpty] = useState<boolean>(false)

  const router = useRouter();


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
                  <Input placeholder="Patient phone number / Patient name" {...field} onChange={(e) => {setPhoneInput(e.target.value)}} value={phoneInput}/>
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
              if (phoneInput.trim() === '') {
                return;
              }
              setLoading(true);
              const response = await fetch(`/api/patient?phone=${phoneInput.trim()}`);
              const { res } = await response.json();
              setLoading(false);
              setRes(res);
              if (res.length === 0) {
                toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: "Can't find any patient with that information!",
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
            No record of this patient in the database!
          </TableCaption>
        }
        <TableHeader>
          <TableRow>
            <TableHead>Patient number</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
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
            </TableRow>
          }
          {

            res && res.map((data, idx) => {
              return (
                <TableRow className="cursor-pointer" key={idx} onClick={() => {router.push(`/patients/info?id=${data.patient_number}`)}}>
                  <TableCell className="font-medium">{data.patient_number}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>{data.first_name}</TableCell>
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