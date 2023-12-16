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
import { formatDateTime, addHoursToDateTime} from "@/lib/utils";
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
  admissiontime: z.string().nullish(),
  doctorcode: z.string().length(10, {
    message: "*Doctor code must be input.",
  }),
  result: z.string().max(200, {
    message: "*Result must be at most 200 characters.",
  }),
  starttime: z.string().min(1, {
    message: "*Start timestamp must be input."
  }),
  endtime: z.string(),
});



export default function Login() {
  const router = useRouter()

  const [insertState, setInsertState] = useState<boolean>(false)
  const [insertLoading, setInsertLoading] = useState<boolean>(false)
  const [warning, setWarning] = useState<string>("Data input invalid!")

  const [docList, setDocList] = useState<{label: string, value: string}[]>([])
  const [ipLoading, setIpLoading] = useState<boolean>(false)

// ...
  const [ip, setIp] = useState<string>('')
    
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const admissiontime = searchParams.get("admissiontime");

  
  useEffect(() => {
    const getInfo = async () => {
      if (id && admissiontime) {
        setIpLoading(true);
        const response = await fetch(`/api/patient/add/treatment?id=${id}`);
        const { ip } = await response.json();
        setIp(ip)
        setIpLoading(false);
      } else {
        setIp('')
      }

      const response1 = await fetch(`/api/employee?type=d`);
      const { doctor, nurse } = await response1.json();
      setDocList(combineCodeAndConcat(doctor))

    };
    getInfo();
  }, []);


// 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      result: "",
      doctorcode: "",
      starttime: "",
      endtime: ""
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { doctorcode, endtime, result, starttime  } = values;    
    // const ipcode = ip === "" ? displayIP(maxip+1) : ip;

    setInsertLoading(true);
    const addPatient = async () => {
      setInsertLoading(true)
      const response = await fetch('/api/patient/add/treatment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          result,
          endtime: addHoursToDateTime(endtime),
          starttime: addHoursToDateTime(starttime),
          doctorcode,
          id,
          ip,
          admissiontime: addHoursToDateTime(admissiontime),
        })
      });
      const { res, warning } = await response.json();
      setInsertLoading(false);
      setInsertState(res === 'success')
      setWarning(warning)
      console.log(res)
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
                    ip} 
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
                <FormLabel>Admission timestamp</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient&apos;s firstname" {...field} disabled 
                  value={formatDateTime(admissiontime)}/>
                </FormControl>
                <FormDescription>
                Inpatient&apos;s admission timestamp.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

            



        <FormField
          control={form.control}
          name="doctorcode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Doctor code *</FormLabel>
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
                        ? docList.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select doctor"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search doctor..." />
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandGroup>
                      {docList.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue("doctorcode", language.value)
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
                List of doctor information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Result</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient&apos;s result" {...field} />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s result.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="starttime"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Start timestamp *</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s start timestamp.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endtime"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>End timestamp</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                  Inpatient&apos;s end timestamp.
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
                      <p className="text-green-500 font-semibold text-lg">Insert treatment successful</p>
                      :
                      <p className="text-destructive font-semibold text-lg">Insert treatment fail</p>

                  }
                  
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {
                    insertLoading ? 
                    <p>Loading...</p>
                    :
                      insertState ? 
                      <p>Treatment data is inserted! Press Continue to redirect to patient information page.</p>
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
