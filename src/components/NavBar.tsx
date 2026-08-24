"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { User } from "better-auth";

export default function NavBar({ initialUser }: { initialUser?: User }) {
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user || initialUser;
  const { theme, setTheme } = useTheme();

  const signout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
        onError: (ctx) => {
          toast({
            title: "Sign out failed",
            description: ctx.error.message,
          });
        }
      }
    });
  };

  return (
    <nav className="fixed w-full top-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 sm:py-4 md:px-8 px-4 transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <a href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Inkognito
        </a>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full w-9 h-9"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {(isPending && !user) ? (
            <div className="w-[72px] h-8 rounded-md bg-muted/60 animate-pulse"></div>
          ) : user ? (
            <Button
              onClick={signout}
              variant="secondary"
              size="sm"
              className="font-medium"
            >
              Sign out
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button
                variant="default"
                size="sm"
                className="font-medium"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
