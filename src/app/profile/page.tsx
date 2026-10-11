"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  async function handleUpdateName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newName = name.trim();

    if (!newName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (newName === session?.user?.name) {
      toast("নামে কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: newName,
      });

      if (result.error) {
        toast.error(result.error.message || "নাম পরিবর্তন করা যায়নি");
        return;
      }

      await authClient.getSession();
      toast.success("নাম সফলভাবে পরিবর্তন হয়েছে!");
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("নাম পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "লগআউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে লগআউট হয়েছে!");
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0]">
        <p className="text-emerald-700">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  const user = session.user;
  const userName = user.name || "ইউজার";

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-3 sm:py-2">
      <div className="mx-auto max-w-5xl px-0 sm:px-4">
        {/* Profile heading */}
        <div className="mb-7">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-base text-slate-600 sm:text-xl">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Account information card */}
        <section className="mb-7 rounded-3xl border border-[#e0e8e0] bg-white/80 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-11 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-700 text-3xl font-medium text-white">
              {user.image ? (
                <img
                  src={user.image}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-xl font-semibold text-slate-900 sm:text-2xl">
                {userName}
              </h2>

              <p className="mt-1 break-all text-base text-slate-600 sm:text-xl">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 rounded-xl border border-red-400 px-5 py-3 text-base font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
              {signingOut ? "লগআউট হচ্ছে..." : "↪ সাইন আউট"}
            </button>
          </div>
        </section>

        {/* Update name card */}
        <section className="rounded-3xl border border-[#e0e8e0] bg-white/80 p-6 sm:p-7">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            নাম হালনাগাদ করুন
          </h2>

          <form onSubmit={handleUpdateName}>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-lg font-medium text-slate-900"
            >
              নাম
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              required
              maxLength={100}
              className="mb-4 w-full rounded-xl border border-[#d1d8d2] bg-transparent px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-base font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সংরক্ষণ হচ্ছে..." : "নাম হালনাগাদ করুন"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}