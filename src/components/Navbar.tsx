"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { space } from "postcss/lib/list";
import { Button } from "@react-email/components";
function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav>
      <div className="w-[100%] bg-gray-200 h-[50px] flex justify-between px-10 align-middle shadow-lg py-10 ">
        <a href="#" className=" font-bold text-2xl self-center ">
          Mystry Messages
        </a>
        {session ? (
          <>
            <span className="text-xl self-center hidden lg:block  ">
              {" "}
              👋🤗 Welcome, {user.username || user.email}
            </span>
            <div className="felx gap-4 self-center">
              <button
                onClick={() => signOut()}
                className="bg-black text-white rounded-full px-4 py-2 border border-white w-full "
              >
                Logout
              </button>
              <Link href="/dashboard">
                <button className="bg-black text-white rounded-full px-4 py-2 border border-white w-full ">
                  Dashboard
                </button>
              </Link>
            </div>
          </>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
