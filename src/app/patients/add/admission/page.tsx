"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addHoursToDateTime} from "@/lib/utils";



function displayIP(ip: number) {
  var ipstr = ip.toString();
  while (ipstr.length < 9) {
    ipstr = '0' + ipstr;
  }
  return 'IP' + ipstr
}


const formSchema = z.object({
  inpatientcode: z.string().nullish(),
  nursecode: z.string().length(10, {
    message: "*Nursecode must be exactly 10 characters.",
  }),
  diagnosis: z.string().min(1, {
    message: "*Diagnosis must be at least 1 characters.",
  }).max(200, {
    message: "*Diagnosis must be at most 200 characters.",
  }),
  sickroom: z.string().length(6, {
    message: "*Sickroom must be exactly 6 characters.",
  }),
  fee: z.string().min(3, {
    message: "*Fee must be at least 3 characters.",
  }),
  admissiontime: z.string(),
  dischargetime: z.string(),
  recovered: z.enum(["yes", "no"], {
    required_error: "You need to select recover state.",
  })
});



export default function Login() {
  const router = useRouter(); 

  const [insertState, setInsertState] = useState<boolean>(false)
  const [insertLoading, setInsertLoading] = useState<boolean>(false)
  const [warning, setWarning] = useState<string>("Data input invalid")

// ...
  const [ip, setIp] = useState<string>('')
  const [maxip, setMaxip] = useState<number>(0)
    
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  useEffect(() => {
    const getInfo = async () => {
      if (id) {
        const response = await fetch(`/api/patient/add/admission?id=${id}`);
        const { state, ip, maxip  } = await response.json();
        setIp(ip)
        setMaxip(maxip)
      } else {
        setIp('')
        setMaxip(0)
      }
    };
    getInfo();
  }, []);


// 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { nursecode, diagnosis, sickroom, recovered, fee, admissiontime, dischargetime } = values;    
    const ipcode = ip === "" ? displayIP(maxip+1) : ip;

    // setInsertLoading(true);
    const addPatient = async () => {
      setInsertLoading(true)
      const response = await fetch('/api/patient/add/admission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id,
          ipcode,
          nursecode,
          diagnosis,
          sickroom,
          recovered,
          fee,
          admissiontime: addHoursToDateTime(admissiontime),
          dischargetime: addHoursToDateTime(dischargetime)
        })
      });
      const { res, warning } = await response.json();
      setInsertLoading(false);
      setInsertState(res === 'success')
      setWarning(warning)
      console.log(warning)
    }
    addPatient();
  }

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-6xl mx-auto my-6"
        >
          
          <FormField
            control={form.control}
            name="inpatientcode"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Inpatient code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient's firstname" {...field} disabled 
                  value={ip === "" ? displayIP(maxip+1) : ip} 
                  />
                </FormControl>
                <FormDescription>
                Inpatient's code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
              control={form.control}
              name="admissiontime"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Admission timestamp</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                  Inpatient's admission timestamp.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nursecode"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Nurse Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient nurse's code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient's diagnosis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sickroom"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Sickroom</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient's sickroom.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="recovered"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Recovered</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient's admission fee.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dischargetime"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Discharge timestamp</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                  Inpatient's discharge timestamp.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="submit">Submit</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {
                    insertLoading ? 
                    <p className="text-lg font-semibold">Loading...</p>
                    : 
                      insertState ? 
                      <p className="text-green-500 font-semibold text-lg">Insert admission successful</p>
                      :
                      <p className="text-destructive font-semibold text-lg">Insert admission fail</p>

                  }
                  
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {
                    insertLoading ? 
                    <p>Loading...</p>
                    :
                      insertState ? 
                      <p>Admission data is inserted! Press Continue to redirect to patient information page.</p>
                      :
                      <p>{warning}</p>


                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {
                  insertState ? 
                  <AlertDialogAction>
                    <Button variant='default' size='sm' onClick={() => {
                      if (!insertLoading) {
                        router.push(`/patients/info?id=${id}`)
                      }
                    }}>Continue</Button>
                  </AlertDialogAction>
                  :
                  <></>
                }
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
  );
}
