"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { editUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "@/components/error-message";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

// Define the structure of the form data
interface UserFormData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

const EditUserPage = () => {
  const { id } = useParams(); // Get the `id` from the dynamic route
  const { push } = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [globalError, setGlobalError] = useState<string>("");

  // Use React Hook Form with Zod schema validation
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
    },
  });

  const { reset } = form; // Destructure reset for easier usage

  // Fetch user details when the component loads
  const fetchUser = useCallback(async () => {
    if (!session?.accessToken || !id) return;

    try {
      const response = await axios.get(
        `http://103.196.153.154:8000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const userData = response.data;
      console.log(userData);

      // Populate form with fetched user data
      reset(userData); // Use React Hook Form's reset to populate form fields
    } catch (error) {
      console.error("Error fetching user", error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, id, reset]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser, id]);

  // Handle form submission
  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    if (!session?.accessToken || !id) return;

    try {
      await axios.put(
        `http://103.196.153.154:8000/api/users/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      push("/dashboard/users"); // Redirect to the users page
    } catch (error) {
      console.error("Error updating user", error);
      alert("Failed to update user. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className=" p-8 flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className=" p-8 w-full">
      {/* Make Back Button */}
      <Button
        onClick={() => push("/dashboard/users")}
        className="mb-4"
        variant="default"
        color="gray-800"
      >
         {/* Make me arrow left white */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </Button>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit User</h1>
      {globalError && <ErrorMessage error={globalError} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    autoComplete="off"
                    {...field} // React Hook Form manages the value and onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    autoComplete="off"
                    {...field} // React Hook Form manages the value and onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="off"
                    {...field} // React Hook Form manages the value and onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="off"
                    {...field} // React Hook Form manages the value and onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            pending={form.formState.isSubmitting}
            text="Save Changes"
            width="w-50"

          />
        </form>
      </Form>
    </main>
  );
};

export default EditUserPage;
