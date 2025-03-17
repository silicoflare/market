"use client";

import { LoaderIcon, StoreIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { status } = useSession();

  return (
    <div className="fixed top-0 left-0 px-3 pt-3 w-full">
      <div className="navbar bg-base-100 shadow-sm w-full rounded-md">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            <StoreIcon size={20} />
          </Link>
        </div>
        <div className="flex-none pr-2">
          {status === "loading" ? (
            <LoaderIcon size={20} className="text-primary animate-spin" />
          ) : status === "authenticated" ? (
            <button
              className="btn btn-primary"
              onClick={async () => await signOut()}
            >
              Logout
            </button>
          ) : (
            <button className="btn btn-outline btn-primary">Login</button>
          )}
        </div>
      </div>
    </div>
  );
}
