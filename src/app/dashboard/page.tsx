"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setSwitchLoading] = useState<boolean>(false);
  const [AnimatedUsername, setAnimatedUsername] = useState<string>("");

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => messageId !== message._id));
  };

  const { data: session } = useSession();
  const user: User = session?.user;
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  useEffect(() => {
    if (user?.username || user?.email) {
      const name = user?.username || user?.email;

      let i = 0;
      const typingIntervel = setInterval(() => {
        if (i < name.length && AnimatedUsername.length < name.length) {
          setAnimatedUsername((prev: string) => prev + name[i]);
          i++;
        } else {
          clearInterval(typingIntervel);
        }
      }, 100);

      return () => clearInterval(typingIntervel);
    }
  }, [user]);

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);

      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch message settings",
          variant: "destructive",
        });
      } finally {
        setSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setSwitchLoading, setValue]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    fetchMessages();
    fetchAcceptMessages();
  }, [fetchAcceptMessages, fetchMessages]);

  //handle switch change

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);

      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  const { username } = session ? session?.user : "undefined";

  // TODO: Do more research
  const baseUrl = `${window?.location?.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);

    toast({
      title: "URL COPY!",
      description: "URL has copy to clipboard",
    });
  };
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <div className="text-xl self-center block lg:hidden  ">
        {" "}
        👋🤗 Welcome, <span className=" font-bold ">{AnimatedUsername}</span>
      </div>
      <h1 className=" text-2xl lg:text-4xl font-bold my-4">Dashboard</h1>
      <div className="mb-4">
        <h2 className=" text-md lg:text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered  w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex flex-col lg:flex-row gap-5 ">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className=" order-2 lg:order-1 "
        />

        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4  order-1 lg:order-2 "
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="w-4 h-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, idx) => {
            return (
              <MessageCard
                key={idx}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            );
          })
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
