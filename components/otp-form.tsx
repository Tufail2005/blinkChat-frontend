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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type OTPFormProps = React.ComponentProps<"div"> & {
  email: string;
  onVerified: () => void;
};

export function OTPForm({
  className,
  email,
  onVerified,
  ...props
}: OTPFormProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const base_url = process.env.NEXT_PUBLIC_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${base_url}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredentials: true }
      );

      onVerified();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Invalid or expired verification code."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await axios.post(
        `${base_url}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setError("Failed to resend code. Try again.");
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
            Enter verification code
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            We sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-6">
              <Field className="space-y-3">
                <FieldLabel className="text-slate-700 font-medium text-center block">
                  Verification code
                </FieldLabel>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    required
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <FieldDescription className="text-center text-slate-500">
                  Enter the 6-digit code sent to your email.
                </FieldDescription>
              </Field>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  {error}
                </p>
              )}

              <Field className="space-y-5 pt-2">
                <Button
                  disabled={loading || otp.length !== 6}
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-500/30"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                <FieldDescription className="text-center text-slate-600">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-indigo-600 hover:text-indigo-500 font-medium underline underline-offset-4"
                  >
                    Resend
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
