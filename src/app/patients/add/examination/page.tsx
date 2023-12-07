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
} from "@/components/ui/alert-dialog";
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
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addHoursToDateTime } from "@/lib/utils";

function displayOP(ip: number) {
  var ipstr = ip.toString();
  while (ipstr.length < 9) {
    ipstr = "0" + ipstr;
  }
  return "OP" + ipstr;
}

const formSchema = z.object({
  outpatientcode: z.string().nullish(),
  doctorcode: z.string().length(10, {
    message: "*Doctorcode must be exactly 10 characters.",
  }),
  diagnosis: z.string().min(1, {
    message: "*Diagnosis must be at least 1 character.",
  }).max(200, {
    message: "*Diagnosis must be at most 200 characters.",
  }),
  fee: z.string().min(3, {
    message: "*Password must be at least 3 characters.",
  }),
  examtime: z.string(),
  nextexamdate: z.date({
    required_error: "Next exam date is required.",
  }),
});

export default function Login() {
  const router = useRouter();

  const [insertState, setInsertState] = useState<boolean>(false);
  const [insertLoading, setInsertLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>("Data input invalid");

  // ...
  const [ip, setIp] = useState<string>("");
  const [maxip, setMaxip] = useState<number>(0);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const getInfo = async () => {
      if (id) {
        const response = await fetch(`/api/patient/add/examination?id=${id}`);
        const { state, ip, maxip } = await response.json();
        setIp(ip);
        setMaxip(maxip);
      } else {
        setIp("");
        setMaxip(0);
      }
    };
    getInfo();
  }, []);

  //
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { doctorcode, diagnosis, fee, examtime, nextexamdate } = values;
    const ipcode = ip === "" ? displayOP(maxip + 1) : ip;

    // setInsertLoading(true);
    const addPatient = async () => {
      setInsertLoading(true);
      const response = await fetch("/api/patient/add/examination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          opcode: ipcode,
          doctorcode,
          diagnosis,
          fee,
          examtime: addHoursToDateTime(examtime),
          nextexamdate,
        }),
      });
      const { res, warning } = await response.json();
      setInsertLoading(false);
      setInsertState(res === "success");
      setWarning(warning);
      console.log(res);
    };
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
          name="outpatientcode"
          render={({ field }) => (
            <FormItem className="basis-1/2">
              <FormLabel>Outpatient code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter patient's firstname"
                  {...field}
                  disabled
                  value={ip === "" ? displayOP(maxip + 1) : ip}
                />
              </FormControl>
              <FormDescription>
              Outpatient's code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctorcode"
          render={({ field }) => (
            <FormItem className="basis-1/2">
              <FormLabel>Doctor Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient's firstname" {...field} />
              </FormControl>
              <FormDescription>
              Outpatient doctor's code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="examtime"
          render={({ field }) => (
            <FormItem className="basis-1/2">
              <FormLabel>Exam timestamp</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} type="datetime-local" />
              </FormControl>
              <FormDescription>
              Outpatient's exam timestamp.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="nextexamdate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next exam date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
              Outpatient's next exam date.
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
              Outpatient's diagnosis.
              </FormDescription>
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
              Outpatient's fee.
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
                {insertLoading ? (
                  <p className="text-lg font-semibold">Loading...</p>
                ) : insertState ? (
                  <p className="text-green-500 font-semibold text-lg">
                    Insert examination successful
                  </p>
                ) : (
                  <p className="text-destructive font-semibold text-lg">
                    Insert examination fail
                  </p>
                )}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {insertLoading ? (
                  <p>Loading...</p>
                ) : insertState ? (
                  <p>
                    Examination data is inserted! Press Continue to redirect to
                    patient information page.
                  </p>
                ) : (
                  <p>{warning}</p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {insertState ? (
                <AlertDialogAction>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      if (!insertLoading) {
                        router.push(`/patients/info?id=${id}`);
                      }
                    }}
                  >
                    Continue
                  </Button>
                </AlertDialogAction>
              ) : (
                <></>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
