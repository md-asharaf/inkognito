"use client";
import * as z from "zod";
import { SignUpSchema } from "@/validation/signUpSchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Github } from "lucide-react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsername = async () => {
    setIsCheckingUsername(true);
    setUserMessage("");
    if (username) {
      try {
        const response = await axios.get(
          `/api/unique-user?username=${username}`
        );
        setUserMessage(response.data?.message || "");
      } catch (error: any) {
        if (error instanceof AxiosError) {
          setUserMessage(error.response?.data?.message);
        } else {
          setUserMessage(error?.message);
        }
      }
    }
    setIsCheckingUsername(false);
  };

  const { mutate: onSubmit, isPending: isSubmitting } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (data: z.infer<typeof SignUpSchema>) => {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
        username: data.username,
        fetchOptions: {
          onSuccess: () => {
            toast({
              title: "Registration successful!",
              description: "Please check your email inbox for the verification link.",
            });
            router.replace(`/sign-in`);
          },
          onError: (ctx) => {
            toast({
              title: "Registration failed",
              description: ctx.error.message,
              variant: "destructive"
            });
          }
        }
      });
    },
  });

  useEffect(() => {
    checkUsername();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <div className="flex-grow flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-8 space-y-8 rounded-3xl bg-card/50 backdrop-blur border border-border/50 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3">
            Join Inkognito
          </h1>
          <p className="text-muted-foreground mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="bg-background/50 hover:bg-background h-11"
            onClick={() => signIn.social({ provider: 'google', callbackURL: '/dashboard' })}
          >
            {/* Simple Google G SVG */}
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-background/50 hover:bg-background h-11"
            onClick={() => signIn.social({ provider: 'github', callbackURL: '/dashboard' })}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-background/50 focus-visible:ring-primary/20 h-11"
                      placeholder="johndoe"
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" /> Checking username...
                    </div>
                  )}
                  {!isCheckingUsername && userMessage && (
                    <p
                      className={`text-xs mt-1 ${userMessage === "username is unique"
                        ? "text-green-500"
                        : "text-destructive"
                        }`}
                    >
                      {userMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-background/50 focus-visible:ring-primary/20 h-11"
                      placeholder="m@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="bg-background/50 focus-visible:ring-primary/20 h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isCheckingUsername || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
