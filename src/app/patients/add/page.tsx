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
import { useState } from "react";


const formSchema = z.object({
  firstname: z.string().min(1, {
    message: "*Firstname must be at least 1 character.",
  }).max(20, {
    message: "*Firstname must be at most 20 characters"
  }),
  lastname: z.string().min(1, {
    message: "*Lastname must be at least 1 character.",
  }).max(20, {
    message: "*Lastname must be at most 20 characters"
  }),
  address: z.string().min(1, {
    message: "*Address must be at least 1 characters.",
  }).max(200, {
    message: "*Address must be at most 200 characters"
  }),
  phone: z.string().max(11, {
    message: "*Phone must be at most 11 characters"
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  })
});


export default function Login() {
  const [insertState, setInsertState] = useState<boolean>(false)
  const [insertID, setInsertID] = useState<number>(0)
  const [insertLoading, setInsertLoading] = useState<boolean>(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      address: "",
      phone: ""
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstname, lastname, address, phone, dob, gender } = values;
    
    setInsertLoading(true);
    const addPatient = async () => {
      const response = await fetch('/api/patient/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstname,
          lastname,
          address,
          phone,
          dob,
          gender
        })
      });
      const { res, id } = await response.json();
      setInsertLoading(false);
      setInsertState(res === 'success')
      setInsertID(id)
      console.log(res)
      console.log(id)
    }
    addPatient();
    console.log(values);
  }

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-6xl mx-auto my-6"
        >
          <div className="flex space-x-10">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Patient's firstname.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's lastname..." {...field} />
                  </FormControl>
                  <FormDescription>
                  Patient's lastname
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient's address..." {...field} />
                </FormControl>
                <FormDescription>
                Patient's address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient's phone..." {...field} />
                </FormControl>
                <FormDescription>
                Patient's phone number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
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
                Patient's date of birth.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Male
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Female
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

            {/* <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Admission timestamp</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Nurse Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Sickroom</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's firstname" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel>Discharge timestamp</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="datetime-local" />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}


          

          
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
                      <p className="text-green-500 font-semibold text-lg">Insert patient successful</p>
                      :
                      <p className="text-destructive font-semibold text-lg">Insert patient fail</p>

                  }
                  
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {
                    insertLoading ? 
                    <p>Loading...</p>
                    :
                      insertState ? 
                      <p>Patient data is inserted! Press Continue to redirect to patient information page.</p>
                      :
                      <p>This patient is already in the database! Press Continue to redirect to patient information page.</p>


                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Button variant='default' size='sm' onClick={() => {
                    if (!insertLoading) {
                      window.location.href = `/patients/info?id=${insertID}`
                    }
                  }}>Continue</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
  );
}
