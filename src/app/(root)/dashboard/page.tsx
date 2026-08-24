"use client";
import { IMessage } from "@/models/message.model";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Edit2, Check, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptMessageSchema } from "@/validation/AcceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useDebounceCallback } from "usehooks-ts";
import { useSession } from "@/lib/auth-client";

export default function DashBoard() {
  const [uniqueLink, setUniqueLink] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { data } = useSession();
  const { watch, register, setValue } = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const debouncedUsername = useDebounceCallback(setNewUsername, 500);

  const user = data?.user;
  const acceptMessage = watch("acceptMessage");

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      setUniqueLink(
        `${window.location.protocol}//${window.location.host}/u/${user.username}`
      );
      setNewUsername(user.username || "");
    }
  }, [user]);

  const checkUsername = async (username: string) => {
    if (!username || username === user?.username) {
      setUsernameMessage("");
      return;
    }
    setIsCheckingUsername(true);
    setUsernameMessage("");
    try {
      const response = await axios.get(
        `/api/unique-user?username=${username}`
      );
      setUsernameMessage(response.data?.message || "");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        setUsernameMessage(error.response?.data?.message);
      } else {
        setUsernameMessage(error?.message);
      }
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    if (isEditingUsername) {
      checkUsername(newUsername);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUsername, isEditingUsername]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(uniqueLink);
    if (inputRef.current) {
      inputRef.current.select();
    }
    toast({
      title: "Link copied to clipboard",
      variant: "default",
    });
  };

  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername === user?.username) {
      setIsEditingUsername(false);
      return;
    }
    setIsUpdatingUsername(true);
    try {
      const response = await axios.post("/api/change-username", { username: newUsername });
      if (response.data.success) {
        toast({ title: "Username updated successfully" });
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: "Failed to update username",
        description: error.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => message._id !== messageId || message.id !== messageId)
    );
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data?.messages);
      return response.data?.messages;
    } catch (error: any) {
      console.log(
        "error fetching messages: ",
        error.response?.data.message
      );
      return error;
    }
  };

  const fetchAcceptMessage = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "/api/accept-message"
      );
      setValue("acceptMessage", response.data.isAcceptingMessages);
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
      return null;
    }
  };

  const toggleAcceptMessage = async () => {
    try {
      await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessage: !acceptMessage,
      });
      setValue("acceptMessage", !acceptMessage);
      toast({
        title: "Success",
        description: "Message settings updated successfully",
        variant: "default",
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

  const { refetch, isFetching } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: fetchMessages,
    enabled: !!user?.id,
  });

  useQuery({
    queryKey: ["accept-message", user?.id],
    queryFn: fetchAcceptMessage,
    enabled: !!user?.id,
  });

  const { mutate: handleSwitchChange, isPending: isSwitchLoading } =
    useMutation({
      mutationKey: ["accept-message", user?.id],
      mutationFn: toggleAcceptMessage,
    });

  if (!user) {
    return null;
  }

  return (
    <div className="flex-grow bg-background/50 pt-24 pb-12 px-4 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Manage your anonymous messages and profile settings.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-card border border-border/50 px-4 py-2 rounded-2xl shadow-sm">
            <Switch
              {...register("acceptMessage")}
              checked={acceptMessage}
              onCheckedChange={() => handleSwitchChange()}
              disabled={isSwitchLoading}
            />
            <span className="text-sm font-medium">
              Accepting Messages
            </span>
          </div>
        </div>

        {/* Profile Link Card */}
        <div className="bg-card/50 backdrop-blur border border-border/50 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              Your Unique Link
              <Badge variant="secondary" className="ml-3 font-normal text-xs bg-primary/10 text-primary hover:bg-primary/20">Public</Badge>
            </h2>
            {!isEditingUsername && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingUsername(true)} className="text-muted-foreground hover:text-primary mt-2 md:mt-0 w-fit">
                <Edit2 className="w-4 h-4 mr-2" /> Change Username
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Share this link on your social profiles to start receiving anonymous feedback.
          </p>

          {isEditingUsername ? (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow flex items-center bg-background border border-primary/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="pl-3 text-muted-foreground text-sm">/u/</span>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    onChange={(e) => debouncedUsername(e.target.value)}
                    className="w-full p-3 bg-transparent text-sm md:text-base focus:outline-none transition-all text-foreground font-medium"
                    placeholder="New username"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleUpdateUsername}
                    disabled={isUpdatingUsername || isCheckingUsername || (usernameMessage !== "username is unique" && newUsername !== user?.username)}
                    className="flex-1 sm:flex-none h-[50px] rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isUpdatingUsername ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingUsername(false);
                      setNewUsername(user?.username || "");
                      setUsernameMessage("");
                    }}
                    className="flex-1 sm:flex-none h-[50px] rounded-xl font-medium border-border/50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
              {isCheckingUsername && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin mr-1" /> Checking availability...
                </div>
              )}
              {!isCheckingUsername && usernameMessage && newUsername !== user?.username && (
                <p className={`text-xs ${usernameMessage === "username is unique" ? "text-green-500" : "text-destructive"}`}>
                  {usernameMessage}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={inputRef}
                value={uniqueLink}
                readOnly
                type="text"
                className="flex-grow p-3 bg-background border border-border rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-muted-foreground"
              />
              <Button
                onClick={copyToClipboard}
                className="w-full sm:w-auto px-8 h-[50px] rounded-xl font-medium shadow-md"
              >
                Copy Link
              </Button>
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">Your Messages</h2>
              <Badge className="bg-primary text-primary-foreground">{messages?.length || 0}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-full px-4 border-border/50 hover:bg-muted"
            >
              <RefreshCw
                className={`${isFetching ? "animate-spin text-primary" : ""} w-4 h-4 mr-2`}
              />
              Refresh
            </Button>
          </div>

          {isFetching && messages?.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-card/30 border border-border/30 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : messages?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message) => (
                <div key={(message._id || message.id) as string}>
                  <MessageCard
                    message={message}
                    onDelete={deleteMessage}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card/30 border border-border/30 rounded-3xl border-dashed">
              <h3 className="text-lg font-semibold">No messages yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                Share your link to start receiving anonymous messages. They will appear here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
