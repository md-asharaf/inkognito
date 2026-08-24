"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { MessageSchema } from "@/validation/MessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2, Sparkles, Send, ShieldQuestion } from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";

export default function SendMessage() {
  const [isUserAcceptingMessages, setIsUserAcceptingMessages] = useState(false);
  const { username: usernameParam } = useParams();
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error: suggestError,
  } = useCompletion({
    api: "/api/suggest-messages",
    streamProtocol: "text",
  });

  const submit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      await axios.post("/api/send-message", {
        ...data,
        username,
      });
      toast({
        title: "Message sent!",
        description: "Your anonymous message was delivered safely.",
      });
      form.reset({ title: "", content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationKey: ["messages", username],
    mutationFn: submit,
  });

  useEffect(() => {
    const isAcceptingMessages = async () => {
      try {
        const res = await axios.get(`/api/check-user-status?username=${username}`);
        setIsUserAcceptingMessages(res.data?.isAcceptingMessages);
      } catch (error: any) {
        setIsUserAcceptingMessages(false);
      } finally {
        setIsLoading(false);
      }
    };
    isAcceptingMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSuggestedMessages = async () => {
    try {
      const currentTitle = form.getValues("title");
      await complete(currentTitle || "");
    } catch (error) {
    }
  };

  const suggestedQuestions = completion ? completion.split("||").filter((q) => q.trim() !== "") : [];

  const handleSuggestionClick = (question: string) => {
    form.setValue("content", question.trim());
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow bg-background/50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <ShieldQuestion className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Send <span className="text-primary">@{username}</span> a Message
          </h1>
          <p className="text-muted-foreground">
            Your identity will remain completely anonymous.
          </p>
        </div>

        {!isUserAcceptingMessages ? (
          <Card className="text-center p-8 bg-destructive/10 border-destructive/20 rounded-2xl shadow-none">
            <p className="text-destructive font-medium">This user is currently not accepting messages.</p>
          </Card>
        ) : (
          <Card className="bg-card/50 backdrop-blur border-border/50 rounded-3xl shadow-xl relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

            <CardContent className="p-6 md:p-8 pt-6 md:pt-8 relative z-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => handleSubmit(data))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Title (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Give your message a title..."
                            className="bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-foreground">Your Message</FormLabel>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={fetchSuggestedMessages}
                            disabled={isSuggestLoading}
                            className={`h-8 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-none transition-all ${isSuggestLoading ? 'animate-pulse opacity-80' : ''}`}
                          >
                            {isSuggestLoading ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 mr-1" />
                            )}
                            AI Suggest
                          </Button>
                        </div>

                        {/* AI Suggestions Display */}
                        {(suggestedQuestions.length > 0 || suggestError) && (
                          <div className="flex flex-wrap gap-2 mt-2 mb-3">
                            {suggestError ? (
                              <p className="text-xs text-destructive animate-in fade-in">Failed to load suggestions.</p>
                            ) : (
                              suggestedQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSuggestionClick(question)}
                                  className="text-xs bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border/50 rounded-full px-3 py-1.5 text-left max-w-full truncate animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"
                                  style={{ animationDelay: `${index * 150}ms` }}
                                >
                                  {question.replace(/["']/g, '')}
                                </button>
                              ))
                            )}
                          </div>
                        )}

                        <FormControl>
                          <Textarea
                            placeholder="Type something nice, or ask a burning question..."
                            {...field}
                            className="min-h-[160px] bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-xl resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 rounded-xl text-md font-semibold shadow-lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Anonymously
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
