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
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedIn } from "@/store/reducers/authReducer";
import { useAuthActions } from "@/store/reducers/authReducer";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const isLoggedIn = useAppSelector(selectLoggedIn);
  const { login } = useAuthActions();

  const handleLogin = () => {
    login({username: 'test', password: 'test'});
    router.push('/');
  }

  const router = useRouter();
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="dark:bg-primary-dark dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input id="password" type="password" required className="dark:bg-primary-dark dark:text-white" />
          </div>
          <Button type="submit" className="w-full text-white dark:text-black" onClick={handleLogin}>
            Login
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
