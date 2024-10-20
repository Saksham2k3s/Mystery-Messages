"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const Page = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

 

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
      const result =  await signIn('credentials', {
        redirect: false,
        identifier: identifier,
        password: password
       })


        if (result?.error?.includes("Please verify your account first")) {
          // Extract the username by splitting the error message
          const username = result.error.split("Please verify your account first, ")[1].replace('.', '');
          
          router.replace(`/verify/${username}`);
        }
        
       if(result?.error){
         toast({
          title: "Login Error",
          description: "Incorrect email or password",
          variant: 'destructive'
         })
       }
      
       if(result?.url){
          router.replace('/dashboard')
       }
  };

  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5 ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight md:text-5xl mb-6">
            Login to Mistery Message
          </h1>
          <p className="mb-5">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-bold">
              Email or Username
            </label>
            <Input
              id="identifier"
              placeholder="email or username"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-bold">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isSubmiting} className=" items-center " >
            {isSubmiting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>
            Do not have account yet?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page; 