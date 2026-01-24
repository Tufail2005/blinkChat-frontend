"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [isForgotPassword, setIsForgotPassword] = useState(false);


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <div className="flex justify-center pt-2">
          <img src="/logo.png" alt="logo" className="h-12 w-auto"/>
        </div>
        <CardHeader>
          <CardTitle>
            {isForgotPassword ? "Reset your password" :"Login to your account"}
            </CardTitle>
          <CardDescription>
            {isForgotPassword ? "Enter your email and we'll send you a reset link":"Enter your email or username to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              {!isForgotPassword?(<>
                <Field>
                <FieldLabel htmlFor="email">Username</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com  or  @name"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <button 
                  onClick={()=>setIsForgotPassword(true)}
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </button>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" className="border bg-black text-white">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="signup">Sign up</a>
                </FieldDescription>
              </Field>
              </>):
                <>
                <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="m@example.com  or  @name"
                  required
                />
              </Field>

              <Field>
                    <Button type="submit" className=" border w-full bg-black text-white">
                      Send Reset Link
                    </Button>
                    <div className="mt-2 text-center text-sm">
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="underline underline-offset-4"
                      >
                        Back to Login
                      </button>
                    </div>
                  </Field>
              </>}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
