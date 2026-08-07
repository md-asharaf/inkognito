import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import Provider from "@/context/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inkognito - Honest feedback, without the filter",
  description: "Receive completely anonymous feedback, messages, and questions. True Feedback where your identity remains a secret.",
  openGraph: {
    title: "Inkognito",
    description: "Receive completely anonymous feedback, without the filter.",
    type: "website",
    siteName: "Inkognito",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkognito",
    description: "Receive completely anonymous feedback, without the filter.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Provider>
        <body className={inter.className + " min-h-screen flex flex-col"}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="h-[52px] sm:h-[68px]">
              <NavBar />
            </div>
            {children}
            <footer className="h-[24px] sm:h-[40px]">
              <div className="fixed bottom-0 w-full text-center p-2 text-xs text-muted-foreground z-20 bg-background/80 backdrop-blur-sm border-t border-border/50">
                © 2026 Inkognito. All rights reserved.
              </div>
            </footer>
            <Toaster />
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
