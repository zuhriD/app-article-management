"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface ListUsers {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

// Define the type for the action row
type UserRow = ListUsers;

const UsersPage = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();

  const fetchUsers = async () => {
    if (!session?.accessToken) {
      console.log("No access token found, skipping fetch");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const usersData = response.data;
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error("Expected users to be an array but got:", usersData);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, accessToken: string | undefined) => {
    if (!accessToken) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return; // If the user clicks "Cancel", abort the deletion

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("User deleted successfully!");
      // You can refresh the users list or redirect after deletion
      window.location.reload(); // Reload the page to update the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete the user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session?.accessToken]);

  const columns: TableColumn<UserRow>[] = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "First Name", selector: (row) => row.first_name, sortable: true },
    { name: "Last Name", selector: (row) => row.last_name, sortable: true },
    { name: "Username", selector: (row) => row.username, sortable: true },
    {
      name: "Actions",
      cell: (row: UserRow) => (
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/users/edit/${row.id}`}
            className="text-blue-500 hover:underline"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id, session?.accessToken)}
            className="ml-4 text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800">Users</h1>
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          pointerOnHover
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "hsl(222 47% 11% / 1)", // Tailwind indigo-700
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
            headCells: {
              style: {
                padding: "12px",
              },
            },
            cells: {
              style: {
                padding: "12px",
                fontSize: "14px",
                color: "#374151", // Tailwind gray-700
              },
            },
            rows: {
              style: {
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#E5E7EB", // Tailwind gray-200
                },
              },
            },
            pagination: {
              style: {
                borderTop: "1px solid #E5E7EB", // Tailwind gray-300
                padding: "10px",
              },
            },
          }}
        />
      </div>
    </main>
  );
};

export default UsersPage;
