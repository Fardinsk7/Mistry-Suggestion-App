"use client"
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useForm } from 'react-hook-form'
import { verifySchema } from '@/schemas/verifySchema'
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/toaster'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    //Zod Implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            console.log("Username", params.username)
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace("/api/sign-in")
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Failed to Verify Code",
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })

        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the 6-digit verification code sent to your email</p>
                </div>

            {/* Initializing Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">
                        Submit
                    </Button>
                </form>

            </Form>
            </div>
            <Toaster/>
        </div>
    )
}

export default VerifyAccount
