
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import PriceTicker from "./PriceTicker";


interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    setTodayDate(
      new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    async function fetchCategories() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/categories"
        );

        if (!response.ok) {
          throw new Error("Categories load failed");
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Category API error:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* First row: Logo, date and sign in/up */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 sm:h-12 sm:w-12">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={28}
                height={28}
                className="object-contain brightness-0 invert"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                বাজার দর
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {todayDate}
              </p>
            </div>
          </Link>

          <div className="shrink-0">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Second row: 8 categories under the logo */}
      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-b border-slate-200"
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="flex items-center justify-start gap-2 overflow-x-auto py-2">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const isActive =
                pathname === href ||
                pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={category.id}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Third row: Full-width product ticker */}
      <PriceTicker />
    </header>
  );
}