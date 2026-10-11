"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { SiGoogle, SiGithub } from "@icons-pack/react-simple-icons";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  useEffect(() => {
    if (searchParams.get("reason") === "auth-required") {
      toast.error("পণ্য দেখতে আগে সাইন ইন করুন!", {
        duration: 5000,
        position: "top-center",
      });

      // একই toast বারবার না দেখানোর জন্য URL পরিষ্কার করা
      window.history.replaceState(null, "", "/sign-up");
    }
  }, [searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন।");
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("রেজিস্ট্রেশন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setSocialLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "Social login ব্যর্থ হয়েছে");
        setSocialLoading("");
      }
    } catch {
      toast.error("Social login করতে সমস্যা হয়েছে");
      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-[540px] flex-1 flex-col items-center justify-center bg-[#f0f5f0] px-4 py-10 sm:py-14">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          অ্যাকাউন্ট তৈরি করুন
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-[500px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-800">
              নাম
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-800">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-800">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-500">অথবা</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialLogin("google")}
            className="flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SiGoogle size={20} color="#4285F4" />
            <span>{socialLoading === "google" ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}</span>
          </button>

          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialLogin("github")}
            className="flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SiGithub size={20} color="#181717" />
            <span>{socialLoading === "github" ? "অপেক্ষা করুন..." : "GitHub দিয়ে চালিয়ে যান"}</span>
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/sign-in" className="font-bold text-emerald-700 hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="mt-5 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
