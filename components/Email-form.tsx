"use client";

import { useState } from "react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

type EmailFormProps = React.ComponentProps<"div"> & {
  onSuccess: (email: string) => void;
};

export function EmailForm({ className, onSuccess, ...props }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const base_url = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${base_url}/api/auth/send-otp`, { email },{ withCredentials: true });

      onSuccess(email);
    } catch (err) {
      console.error(err);
      setError("Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-xl px-8", className)}
      {...props}
    >
      <Card className="w-full max-w-2xl border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <CardHeader className="space-y-3 text-center px-8 pt-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Verify your Email
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Enter your email below to receive a verification code
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-6">
              <Field className="space-y-2">
                <FieldLabel
                  htmlFor="email"
                  className="text-slate-700 font-medium"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </Field>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                  {error}
                </p>
              )}

              <Field className="space-y-5 pt-2">
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-500/30"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>

                <FieldDescription className="text-center text-slate-600">
                  already have an account?{" "}
                  <a
                    href="signin"
                    className="text-indigo-600 hover:text-indigo-500 font-medium underline underline-offset-4"
                  >
                    Sign In
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
