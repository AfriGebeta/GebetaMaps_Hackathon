"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import Image from "next/image";

const Header = () => {
  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
  });
  return (
    <>
      <div className="h-[80px] w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#5C1B96] via-[#5D4792] via-[#5E7E8C] via-[#7B549A] via-[#9E21AA] via-[#A5139C] to-[#C825B8]">
        <div className="w-full flex justify-between items-center px-8 absolute top-0 h-16">
          <Image
            src="/img/logo.png"
            alt="LIYT Logo"
            className="h-10"
            width={100}
            height={100}
          />
          <div className="flex space-x-6 text-white">
            <Link href="/">
              <p>Home</p>
            </Link>
            <Link href="/About">
              <p>About</p>
            </Link>
            {userId !== null ? (
              <>
                <Link href={"/Dashboard"}>
                  {" "}
                  <p>Dashboard</p>
                </Link>
                <Link href={"/Development"}>
                  {" "}
                  <p>Developers</p>
                </Link>
                <Link href={"/Driver"}>
                  {" "}
                  <p>Driver</p>
                </Link>
              </>
            ) : null}
          </div>
          {userId === null ? (
            <button
              className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-purple-600 transition"
              onClick={() => (window.location.href = "/signupLanding")}
            >
              Sign Up
            </button>
          ) : (
            <Link href={"/Profile"}>
              <VscAccount className="text-white text-4xl" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
