import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;








