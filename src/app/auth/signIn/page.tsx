"use client"
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import Line from "@/components/ui/line"
import Image from "next/image"
import { signIn } from "next-auth/react"

const formSchema = z.object({
  username: z.string().min(1, {
    message: "*Username must be at least 2 characters.",
  }),
  password: z.string().min(1, {
    message: "*Password must be at least 2 characters.",
  }),
})

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;
    signIn('credentials', {
      username,
      password,
      callbackUrl: "/"
    })
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className="flex w-full h-full lg:flex-row-reverse flex-col items-center gap-y-12 justify-between">
      <div className="lg:basis-1/2 lg:w-0 w-full flex items-center justify-center px-20">
        <div className="w-96 lg:mt-0 mt-10">
          <h1 className="text-3xl font-semibold lg:mb-12 mb-8">Sign in to your account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel className="mb-3 hidden lg:block">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="lg:mb-10 mb-6">
                    <FormLabel className="mb-3 hidden lg:block">Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password..." type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="default" size="lg" className="w-full" type="submit">Sign In</Button>
            </form>
          </Form>
          <Line text="or"/>
          <Button variant="outline" size="lg" className="w-full">
            <Image src="/auth/login/googleIcon.png" width={20} height={20} priority={true} alt="GoogleIcon" className="mr-6"/>
            Sign in with Google
          </Button>
        </div>
      </div>
      <div className="lg:basis-1/2 w-full lg:h-full h-44 flex justify-center">
        <Image src="/auth/login/hospitalBG.jpg" width={0} height={0} priority={true} alt="HospitalBG" className="mt-0 lg:h-full w-full lg:basis-1/2 object-cover lg:rounded-none blur-[2px]"/>
      </div>
    </div>
  )
}






