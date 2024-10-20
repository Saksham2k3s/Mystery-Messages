"use client"
import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { Loader2 } from "lucide-react";
function Page() {
    const { username } = useParams();
    const {toast} = useToast();
    const [ suggestedMessages, setSuggestedMessages ] = useState<string[]>([]);
    const [ suggestMessageLoading, setSuggestMessageLoading ] = useState<boolean>(false)
    const [ input, setInput ] = useState('');
    const [loading, setLoading] = useState(false)

    const handleSuggesMessages = async () => {
      setSuggestMessageLoading(true)
       try {
          const response = await axios.post<ApiResponse>('/api/suggest-messages');
          const messagesArray = response.data?.messages?.split('||');
          setSuggestedMessages(messagesArray);
          
       } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message || "Failed to fetch suggested messages",
          variant: "destructive"
        })
       } finally {
        setSuggestMessageLoading(false)
       }
    }
    const handleSendMessage = async () => {
        
       try {
        setLoading(true);
        const response = await axios.post<ApiResponse>(`/api/send-message`, { username: username, content: input });
   
        toast({
            title: "Success",
            description: "Message send successfully!",
        })

        setInput('')
       } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message || `Failed to send message to ${username}`,
          variant: "destructive"
        })
       }
       finally{
         setLoading(false)
       }
    }
  return (
    <>
    <main className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl' >
        <div className='text-xl font-bold mb-4' >Send Anonymous Messages to @{username}</div>
        <Textarea placeholder="Type your message here." value={input} onChange={(e) => setInput(e.target.value)} />
        <div className='w-full items-center mt-5 flex justify-center' >
        <Button onClick={handleSendMessage} >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>

        {/* Suggest Messages */}

        <div className='mt-5' >
        <Button onClick={handleSuggesMessages} >Suggest Messages</Button>
        <div className='text-lg mt-4' >Click on any message below to select it</div>
        <div className='px-4 py-5 border rounded-xl mt-4 ' >
            <h2 className='text-2xl font-bold' >Messages</h2>
           
           {
            suggestMessageLoading && <div className='flex justify-center' > Generating Messages <Loader2 className='mr-2 h-4 w-4 animate-spin' /> </div>  
           }

            {
               !suggestMessageLoading && suggestedMessages && suggestedMessages.map((message, idx) => {
                    return <div key={idx} className='border text-center text-lg font-semibold py-2 my-3 rounded-xl cursor-pointer ' onClick={() => setInput(message)} >{message}</div>
                })
            }
        </div>
        </div>
    </main>
    </>
  )
}

export default Page