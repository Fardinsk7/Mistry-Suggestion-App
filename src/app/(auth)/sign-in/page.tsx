'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormMessage, FormDescription, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"


const page = () => {
  const { toast } = useToast()
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()



  //Zod Implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials',{
        redirect:false,
        identifier: data.identifier,
        password: data.password,
      })    
      if(result?.error){
        if(result.error == "CredentialsSignIn"){
          toast({
            title: "Login Failed",
            description: "Incorrect username or password",
            variant: "destructive"
          })
        }
        else{
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive"
          })
        }
      }
  
      if(result?.url){
        router.replace('/')
      }
    } catch (error) {
      console.error("Error in Signup: ", error)
      toast({
        title: "Signup Failed",
        description: "Error in Sign In",
        variant: "destructive"
      })
    }
    finally{
      setIsSubmitting(false)
    }
  }




  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mistry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>

        </div>
        {/* Initializing Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field}/>
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                  </>
                ):("Sign In")
              }
            </Button>
          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Don't have an Account?{' '}
            <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-800">Sign Up</Link>
          </p>
        </div>

      </div>
      <Toaster/>
    </div>
  )
}

export default page
