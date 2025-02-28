'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthActions } from "@/store/reducers/authReducer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Change this import

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuthActions();
  const router = useRouter();

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({username: username, password: password});
    if (result.type === 'auth/login/fulfilled') {
      router.push('/');
    }
    setUsername('');
    setPassword('');
  }

  const handleSignup = async(e: React.FormEvent) => {
    e.preventDefault();
    const result = await signup({username: username, password: password});
    if (result.type === 'auth/signup/fulfilled') {
      setIsSignup(false);
    }
    setUsername('');
    setPassword('');
  }

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{isSignup ? "Sign Up" : "Login"}</CardTitle>
        <CardDescription className="text-center">
          {isSignup ? "Enter your email below to sign up for an account" : "Enter your email below to login to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              required
              className="dark:bg-primary-dark dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required className="dark:bg-primary-dark dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full text-white dark:text-black" onClick={isSignup ? handleSignup : handleLogin}>
            {isSignup ? "Sign up" : "Log in"}
          </Button>
          <div className="text-center text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
            <Link href="#" onClick={() => setIsSignup(!isSignup)} className="underline underline-offset-4 hover:text-primary">
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
