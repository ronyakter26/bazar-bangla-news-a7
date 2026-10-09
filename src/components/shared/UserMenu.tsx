"use client";

import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UserMenu() {
const { data: session, isPending } = authClient.useSession();
  const handleSignOut = async () => {
    try {
        await authClient.signOut();
      toast.success("সফলভাবে লগআউট হয়েছে!");
    } catch (error) {
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    }
  };

  // Skeleton Loader - Requirements for BetterAuth loading state
  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="skeleton w-16 h-8 sm:w-20 sm:h-9 rounded-md"></div>
        <div className="skeleton w-16 h-8 sm:w-20 sm:h-9 rounded-md"></div>
      </div>
    );
  }

  // User logged out state
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="btn btn-ghost btn-xs sm:btn-sm md:btn-md font-medium"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="btn btn-emerald text-white bg-emerald-600 hover:bg-emerald-700 btn-xs sm:btn-sm md:btn-md font-medium"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  // User logged in state
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-9 sm:w-10 rounded-full ring ring-emerald-500 ring-offset-base-100 ring-offset-2 overflow-hidden">
          {/* IMAGE PATH INSTRUCTION: 
              Jodi user-er avatar/image na thake, tobe 'public' folder-e 'default-avatar.png' 
              rakhe setar path "/default-avatar.png" hisebe ekhane change korte paren. */}
          <Image
            src={session.user?.image || "https://avatar.iran.liara.run/public"}
            alt={session.user?.name || "ইউজার প্রোফাইল"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 border border-slate-100"
      >
        <li className="px-3 py-2 font-semibold text-slate-800 border-b border-slate-100">
          <span className="block truncate">{session.user?.name || "ইউজার"}</span>
          <span className="text-xs text-slate-500 font-normal block truncate">
            {session.user?.email}
          </span>
        </li>
        <li className="mt-1">
          <Link href="/profile">আমার প্রোফাইল</Link>
        </li>
        <li>
          <button
            onClick={handleSignOut}
            className="text-rose-600 font-medium hover:bg-rose-50"
          >
            লগআউট
          </button>
        </li>
      </ul>
    </div>
  );
}