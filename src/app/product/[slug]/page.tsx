"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  image?: string;
  unit: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  markets: Market[];
}

const toBn = (value: number) =>
  value.toLocaleString("bn-BD", { maximumFractionDigits: 1 });

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-up");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session || !params.slug) return;

    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const result = await response.json();

        const products: Product[] = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.products)
              ? result.products
              : [];

        const found = products.find(
          (item) => item.slug === params.slug
        );

        if (!found) {
          throw new Error("এই পণ্যটি পাওয়া যায়নি");
        }

        if (!cancelled) setProduct(found);
      } catch {
        if (!cancelled) setError("পণ্যের তথ্য পাওয়া যায়নি।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, params.slug]);

  if (isPending || (!session && !isPending)) {
    return (
      <div className="py-20 text-center text-gray-500">
        লগইন যাচাই করা হচ্ছে...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        পণ্যের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {error || "পণ্য পাওয়া যায়নি"}
        </h1>
        <Link
          href="/"
          className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  const prices = product.markets.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minPrice = prices.length
    ? Math.min(...prices)
    : product.today;

  const maxPrice = prices.length
    ? Math.max(...prices)
    : product.today;

  const averagePrice = prices.length
    ? prices.reduce((sum, price) => sum + price, 0) / prices.length
    : product.today;

  const unitName =
    unitNames[product.unit] ?? `প্রতি ${product.unit}`;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <Link href="/" className="text-sm font-medium text-emerald-700">
        ← হোম পেজে ফিরে যান
      </Link>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-4xl">
            {product.image || product.categoryIcon || "🛒"}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.nameBn}
            </h1>
            <p className="mt-2 text-gray-500">
              আজকের দাম: {toBn(product.today)} টাকা — {unitName}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                {product.categoryNameBn}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                {unitName}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {toBn(minPrice)} টাকা
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-2xl font-bold text-rose-600">
              {toBn(maxPrice)} টাকা
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {toBn(averagePrice)} টাকা
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {product.markets.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">বাজার</th>
                  <th className="px-4 py-3">বিভাগ</th>
                  <th className="px-4 py-3">সর্বনিম্ন</th>
                  <th className="px-4 py-3">সর্বোচ্চ</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className="border-t border-gray-100"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {market.market}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {market.division}
                    </td>
                    <td className="px-4 py-3 text-emerald-700">
                      {toBn(market.min)} টাকা
                    </td>
                    <td className="px-4 py-3 text-rose-600">
                      {toBn(market.max)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            এই পণ্যের বাজারভিত্তিক দামের তথ্য নেই।
          </p>
        )}
      </section>
    </main>
  );
}