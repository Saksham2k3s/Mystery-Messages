"use client";

import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

function Page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace('/dashboard');
    } catch (error) {
      console.log("Error while verifying user");
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const resendCodeHandler = async () => {
    try {
      const response = await axios.put(`/api/generate-new-verify-code`, {
        username: params.username,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      console.log("Error while Generating New Verfy Code");
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Something went wrong",
        variant: "destructive",
      });
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-5">Enter the code sent to your email to verify your account.</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              {...form.register("code")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {form.formState.errors.code && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
          <div>Invalid Verification Code? <span onClick={resendCodeHandler} className=' cursor-pointer underline to-blue-500 ' >Resent Code</span></div>
        </form>
      </div>
    </div>
  );
}

export default Page;
