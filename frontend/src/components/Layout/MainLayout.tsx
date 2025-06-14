import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col laptop-sm:flex-row overflow-hidden">
      <div className="hidden laptop-sm:block">
        <Sidebar />
      </div>
      <div className="laptop-sm:hidden">
        <Navbar />
      </div>
      <div className="flex-1 overflow-y-auto w-full p-4 laptop-sm:p-6 text-base laptop-md:text-lg bg-[var(--color-secondary)]">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
