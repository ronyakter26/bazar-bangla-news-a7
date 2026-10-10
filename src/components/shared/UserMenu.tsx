"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await authClient.signOut();
      setIsOpen(false);
      toast.success("সফলভাবে লগআউট হয়েছে!");
    } catch {
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return <div className="skeleton h-10 w-28 rounded-lg" />;
  }

  if (!session) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/sign-in"
          className="btn btn-ghost btn-sm whitespace-nowrap font-medium"
        >
          সাইন ইন
        </Link>

        <Link
          href="/sign-up"
          className="btn btn-sm whitespace-nowrap border-0 bg-emerald-600 font-medium text-white hover:bg-emerald-700"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const userName = session.user?.name || "ইউজার";
  const userImage = session.user?.image;
  const userEmail = session.user?.email;

  return (
    <div ref={menuRef} className="relative shrink-0">
            <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex max-w-[180px] shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-white px-2 py-1.5 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:max-w-[240px] sm:px-3"
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 ring-2 ring-emerald-500">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 object-cover"
            />
          ) : (
            <span className="text-base font-bold text-emerald-700">
              {userName.charAt(0)}
            </span>
          )}
        </span>

        <span className="truncate text-sm font-semibold text-slate-800">
          {userName}
        </span>

        <svg
          className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="menu absolute right-0 top-full z-[100] mt-3 w-64 max-w-[calc(100vw-24px)] rounded-xl border border-slate-100 bg-white p-2 shadow-xl"
        >
          <li className="pointer-events-none mb-1 border-b border-slate-100 pb-2">
            <div className="block min-w-0 rounded-lg px-3 py-2">
              <span className="block truncate font-semibold text-slate-800">
                {userName}
              </span>

              {userEmail && (
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {userEmail}
                </span>
              )}
            </div>
          </li>

          <li>
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              আমার প্রোফাইল
            </Link>
          </li>

          <li>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="font-medium text-rose-600 hover:bg-rose-50"
            >
              {isSigningOut ? "লগআউট হচ্ছে..." : "লগআউট"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}