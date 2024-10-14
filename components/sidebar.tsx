"use client"; // Mark Sidebar as a client component

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { handleSignOut } from "@/app/actions/authActions";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <aside className="fixed w-1/5 flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-center h-16 border-b">
        <Link href="/" className="text-2xl font-bold">
          Article Management
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {session?.user.role === "admin" ? (
            <>
              <li>
                <Link
                  href="/dashboard/users"
                  className={`block p-2 text-gray-700 rounded ${
                    pathname === "/dashboard/users" ? "bg-gray-800 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/articles"
                  className={`block p-2 text-gray-700 rounded ${
                    pathname === "/dashboard/articles" ? "bg-gray-800 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  Articles
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/dashboard/profile"
                  className={`block p-2 text-gray-700 rounded ${
                    pathname === "/dashboard/profile" ? "bg-gray-800 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/articles"
                  className={`block p-2 text-gray-700 rounded ${
                    pathname === "/dashboard/articles" ? "bg-gray-800 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  Articles
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="p-4">
        {!session ? (
          <Link href="/auth/signin">
            <Button variant="default" className="w-full">
              Sign In
            </Button>
          </Link>
        ) : (
          <form action={handleSignOut}>
          <Button variant="default" type="submit" className="w-full">
            Sign Out
          </Button>
        </form>
        )}
      </div>
    </aside>
  );
}
