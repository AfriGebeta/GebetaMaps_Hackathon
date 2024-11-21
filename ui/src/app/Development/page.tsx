"use client";

import React, { useState } from "react";
import { IoMdDocument, IoMdLock, IoMdHome } from "react-icons/io";
import { MdDashboard, MdOutlineLogout } from "react-icons/md";
import { MantineProvider } from "@mantine/core";
import ApiKey from "@/app/Development/apikey/apikey";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Dashboard from "./Dash/dash";

const Page = () => {
  const router = useRouter();
  const tabs = [
    { link: "", label: "Dashboard", icon: MdDashboard },
    { link: "", label: "ApiKey", icon: IoMdLock },
    { link: "", label: "Documentation", icon: IoMdDocument },
  ];

  const [active, setActive] = useState("Dashboard");

  // Generate links dynamically
  const links = tabs.map((item) => (
    <button
      key={item.label}
      className={`flex items-center gap-y-4 space-x-4 p-4 mt-2 rounded-lg w-full text-white 
        hover:bg-gray-200 hover:text-black 
        ${active === item.label ? "bg-gray-300 text-black" : ""}`}
      onClick={() => setActive(item.label)}
    >
      <item.icon className="text-2xl" />
      <span>{item.label}</span>
    </button>
  ));

  // Render dynamic content
  const renderContent = () => {
    switch (active) {
      case "Dashboard":
        return (
          <div>
            <Dashboard />
          </div>
        );
      case "ApiKey":
        return (
          <div>
            <ApiKey />
          </div>
        );
      case "Documentation":
        return <div>Read the Documentation</div>;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <MantineProvider>
      <div className="flex">
        {/* Sidebar */}
        <nav className="flex flex-col justify-between p-10 h-screen w-2/12 bg-gradient-to-br from-[#5C1B96] via-[#5D4792] via-[#5E7E8C] via-[#7B549A] via-[#9E21AA] via-[#A5139C] to-[#C825B8]">
          <div className="w-full">
            <Image
              src="/img/logo.png"
              alt="LIYT Logo"
              width={100}
              height={100}
              className="mb-6"
            />
            {links}
          </div>
          <div>
            <button
              className="flex items-center space-x-2 p-2 mb-2 rounded-lg text-white hover:bg-gray-200 hover:text-black w-full"
              onClick={() => router.push("/")}
            >
              <IoMdHome className="text-2xl" />
              <span>Back To Home</span>
            </button>
            <button
              className="flex items-center space-x-2 p-2 rounded-lg text-white hover:bg-gray-200 hover:text-black w-full"
              onClick={() => alert("Logging out...")}
            >
              <MdOutlineLogout className="text-2xl" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-10">{renderContent()}</main>
      </div>
    </MantineProvider>
  );
};

export default Page;
