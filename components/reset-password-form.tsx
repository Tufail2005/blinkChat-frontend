"use client"
import { useState } from "react"
import axios from "axios"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation";
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

    export function ForgotPasswordForm({
    className,
    ...props
    }: React.ComponentProps<"div">) {
        const base_url = process.env.NEXT_PUBLIC_API_URL;
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [message, setMessage] = useState("");
        const [error, setError] = useState("");

        const searchParams = useSearchParams();
        const token = searchParams.get("token");
        const router = useRouter();

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

            e.preventDefault();
            setError("");
            setMessage("");

            if(password !== confirmPassword){
                setError("Passwords do not match");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
            return;
            }
            setIsLoading(true);
            
            try {
                await axios.post(`${base_url}/api/auth/reset-password`, {
                    token: token,         
                    newPassword: password 
                });

                setMessage("Success! Redirecting to login...");
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
            } catch (err:any) {
                const msg = err.response?.data?.message || "Failed to reset password";
                setError(msg);
            }finally {
                setIsLoading(false);
            }
        }

        if (!token) {
            return <div className="text-center mt-10 text-red-500">Error: No token found in URL.</div>;
        }


    return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
            <div className="flex justify-center pt-2">
            <img src="/logo.png" alt="logo" className="h-12 w-auto"/>
            </div>
            <CardHeader>
            <CardTitle>Enter New Password</CardTitle>
            <CardDescription>
                Enter new password to login to your account
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">New Password</FieldLabel>
                    <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Ex: 12345678"
                    onChange={(e)=>{setPassword(e.target.value)}}
                    required
                    />
                </Field>
                <Field>
                    <div className="flex items-center">
                    <FieldLabel htmlFor="password">Confirm New Password</FieldLabel>
                    </div>
                    <Input 
                    id="confirmpassword" 
                    type="password"
                    placeholder="Ex: 12345678"
                    value={confirmPassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        required />
                </Field>
                <div>
                    {error && (
                        <p style={{ color: "red" }} className="text-sm text-center">
                            {error}
                        </p>
                    )}
                    {message && (
                        <p style={{ color: "green" }} className="text-sm text-center">
                            {message}
                        </p>
                    )}
                </div>
                <Field>
                    <Button
                    type="submit" 
                    className="border-1 bg-black text-white"
                    >{isLoading ? "Updating..." : "Update Password"}</Button>
                </Field>
                </FieldGroup>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}