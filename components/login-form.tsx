"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
  const base_url = process.env.NEXT_PUBLIC_API_URL;
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setemail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //for login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${base_url}/api/auth/forgot-password`,
        { email }
      );

      setMessage(response.data.message);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSigninSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${base_url}/api/auth/login`,
        {
          identifier: username,
          password,
        },
        { withCredentials: true }
      );

      router.push("/message");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <div className="flex justify-center pt-2">
          <img src="/logo.png" alt="logo" className="h-12 w-auto" />
        </div>
        <CardHeader>
          <CardTitle>
            {isForgotPassword ? "Reset your password" : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {isForgotPassword
              ? "Enter your email and we'll send you a reset link"
              : "Enter your email or username to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {!isForgotPassword ? (
              <div>
                <form onSubmit={handleSigninSubmit}>
                  {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded text-center">
                      {error}
                    </div>
                  )}
                  <Field>
                    <FieldLabel htmlFor="email">Username</FieldLabel>
                    <Input
                      id="email"
                      type="text"
                      placeholder="m@example.com  or  @name"
                      required
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <button
                        onClick={() => setIsForgotPassword(true)}
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="border bg-black text-white mt-5"
                    >
                      Login
                    </Button>

                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="signup">Sign up</a>
                    </FieldDescription>
                  </Field>
                </form>
              </div>
            ) : (
              <div>
                <form onSubmit={handleForgotSubmit}>
                  <div className="mb-5">
                    {message && (
                      <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded text-center">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded text-center">
                        {error}
                      </div>
                    )}
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="reset-email"
                        type="email"
                        value={email}
                        placeholder="m@example.com"
                        required
                        onChange={(e) => {
                          setemail(e.target.value);
                        }}
                      />
                    </Field>
                  </div>

                  <Field>
                    <Button
                      type="submit"
                      className=" border w-full bg-black text-white"
                    >
                      {isLoading ? "sending..." : "Send Reset Link"}
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
                </form>
              </div>
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
