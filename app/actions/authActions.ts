"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function handleCredentialsSignin({ username, password }: {
    username: string,
    password: string
}) {
    try {
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false, // Prevent automatic redirection
        });

        // Check if sign-in was successful
        if (result?.error) {
            throw new AuthError(result.error, result.status);
        }

        // Redirect to desired page after successful sign-in
        return { success:true}; // Change to your desired path
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'Invalid credentials',
                    }
                default:
                    return {
                        message: 'Something went wrong.',
                    }
            }
        }
        throw error;
    }
}


export async function handleSignOut() {
    await signOut();
}