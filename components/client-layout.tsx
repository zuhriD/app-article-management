"use client"; // Mark this component as a client component

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './sidebar';

const ClientLayout: React.FC<{ children: React.ReactNode, session: any }> = ({ children, session }) => {
  const pathname = usePathname();
  

  // Define the paths where you want the sidebar to appear
  const sidebarPaths = ['/articles', '/profile', '/users'];

  // Check if the current path is one that requires the sidebar
  const shouldShowSidebar = sidebarPaths.some(path => pathname.startsWith(path));

  return (
    <div className="container">
      {shouldShowSidebar && <Sidebar session={session}/>}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default ClientLayout;
