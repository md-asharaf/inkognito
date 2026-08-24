import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-4 md:px-24">
            
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto mb-20 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Now with AI-powered suggestions
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                    Honest feedback, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                        without the filter.
                    </span>
                </h1>
                
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                    Create your unique link and receive completely anonymous messages, questions, and feedback from your audience, friends, or team.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                    <Link href="/sign-up">
                        <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8 rounded-full border-border/50 hover:bg-muted/50 transition-all">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Feature Showcase Grid */}
            <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                <Card className="flex flex-col items-center text-center border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <div className="flex justify-center p-4 bg-primary/10 rounded-2xl mb-6 text-primary w-fit mx-auto">
                            <ShieldCheck className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">100% Anonymous</h3>
                        <p className="text-muted-foreground">
                            Your identity remains completely hidden. We focus on the message, not the messenger.
                        </p>
                    </CardContent>
                </Card>

                <Card className="flex flex-col items-center text-center border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <div className="flex justify-center p-4 bg-blue-500/10 rounded-2xl mb-6 text-blue-500 w-fit mx-auto">
                            <MessageSquare className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Share Anywhere</h3>
                        <p className="text-muted-foreground">
                            Post your unique link on Instagram, Twitter, or send it directly to your team.
                        </p>
                    </CardContent>
                </Card>

                <Card className="flex flex-col items-center text-center border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-3xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <div className="flex justify-center p-4 bg-violet-500/10 rounded-2xl mb-6 text-violet-500 w-fit mx-auto">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Suggestions</h3>
                        <p className="text-muted-foreground">
                            Writer&apos;s block? Use our AI to suggest engaging and fun questions to ask.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Simulated Messages / Testimonials */}
            <section className="w-full max-w-4xl mx-auto text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
                <h2 className="text-3xl font-bold mb-10">See it in action</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <Card className="rounded-2xl bg-card/80 backdrop-blur border-border/50 hover:bg-card transition-colors shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Anonymous</p>
                                    <p className="text-xs text-muted-foreground">Just now</p>
                                </div>
                            </div>
                            <p className="text-foreground">&quot;Your latest project looks amazing! Keep up the great work.&quot;</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl bg-card/80 backdrop-blur border-border/50 hover:bg-card transition-colors translate-y-0 md:translate-y-6 shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Anonymous</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                            </div>
                            <p className="text-foreground">&quot;What&apos;s your biggest advice for someone learning Next.js?&quot;</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}
