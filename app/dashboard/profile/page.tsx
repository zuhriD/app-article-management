"use client";
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface User {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}

const ProfilePage = () => {
    const {data: session} = useSession();
    const [user, setUser] = React.useState<User | null>(null);

    const fetchUser = async () => {
        if (!session?.accessToken) return;

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            const userData = response.data;
            setUser(userData);
            
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);




  return (
    <div className="min-h-scree mt-4 py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col items-start p-6">
          
          {/* User Info */}
          <div className="row-span-1">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          </div>

            {/* User Data */}
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <p className="text-sm text-gray-500">{user?.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <p className="text-sm text-gray-500">{user?.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <p className="text-sm text-gray-500">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
