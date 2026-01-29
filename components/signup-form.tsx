"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

import AvatarUpload from "@/components/AvatarUpload";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          userName,
          password,
          photo: photoUrl,
        },
        {
          withCredentials: true, //sends verification cookie
        }
      );

      // redirect to message
      router.push("/message");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card {...props}>
      <div className="flex justify-center pt-2">
        <img src="/logo.png" alt="logo" className="h-12 w-auto" />
      </div>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/*  AVATAR UPLOAD */}
        <AvatarUpload
          folderPath="/users/avatars"
          onUploadComplete={(url) => setPhotoUrl(url)}
        />
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </p>
            )}

            <FieldGroup className="pt-4 space-y-3">
              <Button disabled={loading} type="submit">
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <Button variant="outline" type="button" disabled>
                Sign up with Google
              </Button>

              <FieldDescription className="px-6 text-center">
                Already have an account? <a href="signin">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
