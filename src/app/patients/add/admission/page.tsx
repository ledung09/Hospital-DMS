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
import { cn, combineCodeAndConcat } from "@/lib/utils";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"



function displayIP(ip: number) {
  var ipstr = ip.toString();
  while (ipstr.length < 9) {
    ipstr = '0' + ipstr;
  }
  return 'IP' + ipstr
}


const formSchema = z.object({
  inpatientcode: z.string().nullish(),
  nursecode: z.string().max(10, {
    message: "*Nursecode must be input.",
  }),
  diagnosis: z.string().max(200, {
    message: "*Diagnosis must be at most 200 characters.",
  }),
  sickroom: z.string().max(8, {
    message: "*Sickroom must be at most 8 characters.",
  }),
  fee: z.string(),
  admissiontime: z.string().min(1, {
    message: "Admission timestamp must be input."
  }),
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

  const [ipLoading, setIpLoading] = useState<boolean>(false)


  const [nurseList, setNurseList] = useState<{label: string, value: string}[]>([])


// ...
  const [ip, setIp] = useState<string>('')
  const [maxip, setMaxip] = useState<number>(0)
    
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  useEffect(() => {
    const getInfo = async () => {
      if (id) {
        setIpLoading(true);
        const response = await fetch(`/api/patient/add/admission?id=${id}`);
        const { state, ip, maxip  } = await response.json();
        setIp(ip)
        setMaxip(maxip)
        setIpLoading(false);
      } else {
        setIp('')
        setMaxip(0)
      }

      const response1 = await fetch(`/api/employee?type=n`);
      const { doctor, nurse } = await response1.json();
      setNurseList(combineCodeAndConcat(nurse))
    };
    getInfo();
  }, []);


// 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admissiontime: "",
      nursecode: "",
      diagnosis: "",
      sickroom: "",
      recovered: "no",
      fee: "",
      dischargetime: ""
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
          fee: parseInt(fee === "" ? "0" : fee),
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
                  <Input placeholder="Enter patient&apos;s firstname" {...field} disabled 
                  value={
                    ipLoading ? 
                      "...loading"
                    :
                      ip === "" ? displayIP(maxip+1) : ip
                  } 
                  />
                </FormControl>
                <FormDescription>
                Inpatient&apos;s code.
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
                  <FormLabel>Admission timestamp *</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s admission timestamp.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="nursecode"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Nurse Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient&apos;s firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient nurse&apos;s code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}


        <FormField
          control={form.control}
          name="nursecode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Nursecode</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[300px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? nurseList.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select nursecode"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search nurse..." />
                    <CommandEmpty>No nurse found.</CommandEmpty>
                    <CommandGroup>
                      {nurseList.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue("nursecode", language.value)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                List of nurse information.
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
                    <Input placeholder="Enter patient&apos;s diagnosis" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s diagnosis.
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
                    <Input placeholder="Enter patient&apos;s sickroom" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s sickroom.
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
                    <Input placeholder="Enter patient&apos;s fee" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s admission fee.
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
                  Inpatient&apos;s discharge timestamp.
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
