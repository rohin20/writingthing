import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="text-xl font-bold text-primary">
                WritingThing
              </Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Share Your Thoughts with the World
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A beautiful, minimal platform for writers to create, share, and connect. 
              Write your story, build your audience, and inspire others.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <CardTitle>Write Beautifully</CardTitle>
                <CardDescription>
                  Create rich, engaging content with our intuitive editor. 
                  Focus on your words while we handle the formatting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <CardTitle>Share Globally</CardTitle>
                <CardDescription>
                  Reach readers around the world. Your stories deserve to be heard 
                  by everyone who wants to listen.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle>Connect & Grow</CardTitle>
                <CardDescription>
                  Build your community. Follow other writers, engage with readers, 
                  and grow your audience organically.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Next Steps */}
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-xl mb-4">Next steps</h2>
            {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
