"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

    return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
            <div className="flex justify-center pt-2">
            <img src="/logo.png" alt="logo" className="h-12 w-auto"/>
            </div>
            <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
                Enter your email or username to login to your account
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form>
                <FieldGroup>
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
                    <a
                        href="/passwordchange"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                        Forgot your password?
                    </a>
                    </div>
                    <Input id="password" type="password" required />
                </Field>
                <Field>
                    <Button type="submit" className="border-1 bg-black text-white">Login</Button>
                    <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="signup">Sign up</a>
                    </FieldDescription>
                </Field>
                </FieldGroup>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}