import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "username", placeholder: "username" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                let user = null;

                // validate credentials
                const parsedCredentials = signInSchema.safeParse(credentials);
                if (!parsedCredentials.success) {
                    console.error("Invalid credentials:", parsedCredentials.error.errors);
                    return null;
                }
                try {
                    // Make API call to authenticate user using Axios
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        username: credentials.username,
                        password: credentials.password,
                    });

                    // Assuming your API returns user data in the response
                    const { access, refresh } = response.data;

                    // Use the access token to fetch user details
                    const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${access}`, // Set the Authorization header
                        },
                    });

                    const user = userResponse.data; // Assuming the user details are returned here

                    // Check if the user has a valid structure
                    if (!user || !user.id || !user.role) {
                        console.log("Invalid user data");
                        return null;
                    }

                    
                    return { ...user, accessToken: access, refreshToken: refresh };
                } catch (error) {
                    console.error("An error occurred while authenticating the user:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        // Include the user role in the JWT token
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id as string;
                token.role = user.role as string;
                token.accessToken = user.accessToken as string;
                token.refreshToken = user.refreshToken as string;
            }
            return token;
        },
        // Pass the role to the session object
        session: async ({ session, token }) => {4
            session.user.id = token.id;
            session.user.role = token.role;
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            return session;
        },
    }
    ,
    pages: {
        signIn: "/auth/signin"
    }
})