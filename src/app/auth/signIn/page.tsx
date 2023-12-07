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

import Image from "next/image"
import { signIn } from "next-auth/react"

const formSchema = z.object({
  username: z.string().min(1, {
    message: "*Username must be at least 1 character.",
  }).max(20, {
    message: "*Username must be at most 20 characters.",
  }),
  password: z.string().min(1, {
    message: "*Password must be at least 1 character.",
  }).max(50, {
    message: "*Username must be at most 50 characters.",
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
    <div className="flex w-full h-full lg:flex-row-reverse flex-col items-center gap-y-12">
      <div className="lg:basis-1/2 h-full  w-full flex items-center justify-center px-20">
        <div className="w-96 lg:mt-0 mt-10">
          <h1 className="text-3xl font-semibold lg:mb-12 mb-8">Sign in to your account</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>Username</FormLabel>
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
                  <FormItem className="mb-10">
                    <FormLabel>Password</FormLabel>
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
        </div>
      </div>
      {/* <Image src="/auth/login/hospitalBG.jpg" width={0} height={0} priority={true} alt="HospitalBG" className="lg:basis-1/2 mt-0 lg:h-full object-cover blur-[2px]"/> */}
      <div className="lg:basis-1/2 mt-0 lg:h-full bg-zinc-900"/>
    </div>
  )
}






