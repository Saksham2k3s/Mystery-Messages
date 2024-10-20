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

const Page = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 100);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const res = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking Username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmiting(true);

    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, {
        username,
        email,
        password,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmiting(false);
    } catch (error) {
      console.log("Error while signing up user");
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmiting(false);
    }
  };

  const usernameCheckHandler = (e:any) => {
      setIsCheckingUsername(true);
      setUsername(e.target.value)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-6">
            Join Mistery Message
          </h1>
          <p className="mb-5">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm font-bold">
              Username
            </label>
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => debounced(e.target.value)}
            />
            {isCheckingUsername && (
              <div>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p className="text-sm text-gray-500">Checking availability...</p>
              </div>
            )}
            
            {usernameMessage && (
              <p className={`text-sm ${usernameMessage.includes("is available") ? 'text-green-500' : 'text-red-500' }`}>{usernameMessage}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-bold">
              Email
            </label>
            <Input
              id="email"
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Button type="submit" disabled={isSubmiting}>
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
            Already a member?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page; 