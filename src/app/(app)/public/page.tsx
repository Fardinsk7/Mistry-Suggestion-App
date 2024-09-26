"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/model/User';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from "zod";

type FormData = z.infer<typeof messageSchema>

const page = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(messageSchema)
  })
  const content = watch("content")
  const [randomSuggestion, setRandomSuggestion] = useState<string[]>([])
  const [randomSuggestionLoading, setRandomSuggestionLoading] = useState(false)
  const { toast } = useToast()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    // Handle form submission
    try {
      const response = await axios.post('/api/send-message',data);
      console.log(response)
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully."
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error in Sending Suggestion"
      })
    }

    // reset()
  };

  const randomMessageToInput=(e:string)=>{
    console.log(e)
    setValue("content",e)
  }

  const fetchRandomSuggestion = useCallback(async (refresh: boolean = false) => {
    setRandomSuggestionLoading(true)
    try {
      const response = await axios.post('/api/suggest-messages');
      setRandomSuggestion(response.data.message || [])
      console.log(randomSuggestion)
      if (refresh) {
        toast({
          title: "Ramdom Message Suggested"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error in Suggesting Ramdom Message"
      })

    } finally {
      setRandomSuggestionLoading(false)
    }
  }, [randomSuggestion, randomSuggestionLoading])

  useEffect(() => {
    fetchRandomSuggestion()
    console.log(randomSuggestion)
  }, [])

  return (
    <>
      <div className='flex  justify-center flex-col m-5 items-center'>
        <h1 className='text-6xl font-bold m-6'>Public Section</h1>
        <form className="grid w-[80%] gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Enter a username" {...register("username")} />
          {
            errors.username && (<p className='text-red-500'>{errors.username?.message as string}</p>)
          }
          <Textarea placeholder="Type your message here." {...register("content")} />
          {
            errors.content && (<p className='text-red-500'>{errors.content?.message as string}</p>)
          }
          <Button type='submit' disabled={(!content || content.trim() === "")}>Send message</Button>
        </form>

      </div>
      <div className='flex justify-center flex-col items-center'>

        <div className='m-6'>
        <h1 className='text-3xl font-bold '>Get ramdom message suggestion</h1>
        <Button className='mt-3' onClick={()=>fetchRandomSuggestion(true)}>Random Message</Button>
        </div>
        <div className='flex justify-center h-auto m-4 flex-col'>

          {
            !(randomSuggestion.length <= 0) ? (
              randomSuggestion.map((e) => (<div className='m-1 border border-black-500 p-2 text-center cursor-pointer' onClick={()=>randomMessageToInput(e)}>{e}</div>))
            ) : (
              <div className='m-1 border border-black-500 p-2 text-center' aria-disabled={randomSuggestionLoading}>{randomSuggestionLoading?"Please Wait":"Random Suggestion"}</div>
            )
          }
        </div>
      </div>

      <div className='flex justify-center'>
        {!session && (
          <div className='flex '>
            <Button onClick={() => router.replace('/sign-up')} className='m-3'>Create an Account</Button>

          </div>)}
        {session && (<>
          <div className='flex '>
            <Button onClick={() => router.replace('/dashboard')} className='m-3'>Go to Dashboard</Button>

          </div>
        </>
        )}
      </div>
    </>
  )
}

export default page
