"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signInSchema } from "@/lib/zod";
import LoadingButton from "@/components/loading-button";
import {
  handleCredentialsSignin
} from "@/app/actions/authActions";
import { useState } from "react";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { getSession, signIn, useSession } from "next-auth/react";
import LoginLayout from "./layout";

export default function SignIn() {
  const [globalError, setGlobalError] = useState<string>("");
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { data: session } = useSession();
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
        const result = await handleCredentialsSignin(values);
        if (result?.message) {
            setGlobalError(result.message);
        } else if (result?.success) {
            // Wait for the session to update
            const updatedSession = await getSession();
            if(updatedSession?.user.role == "admin") {
              window.location.href = "/dashboard/users";
            }else {
              window.location.href = "/dashboard/profile";
            }
        }
    } catch (error) {
        console.error("An unexpected error occurred. Please try again.", error);
    }
};


  return (
    <LoginLayout>
    <div className="flex items-center justify-center min-h-screen p-4 w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username address"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button will go here */}
              <LoadingButton pending={form.formState.isSubmitting} text="Sign In" width="w-full" />
            </form>
          </Form>

        </CardContent>
      </Card>
    </div>
    </LoginLayout>
  );
}
