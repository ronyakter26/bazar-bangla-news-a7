"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard, { type Product } from "@/components/shared/ProductCard";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

type SortOption = "default" | "low-to-high" | "high-to-low";

const API_URL = "https://api.api-store.workers.dev/api/bazardor";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadCategory() {
      setLoading(true);
      setError(false);
      setCategory(null);
      setProducts([]);

      try {
        const [categoryResponse, productResponse] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(
            `${API_URL}/products?category=${encodeURIComponent(slug)}`
          ),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error("ডেটা লোড করা যায়নি");
        }

        const categories: Category[] = await categoryResponse.json();
        const productData: Product[] = await productResponse.json();

        const foundCategory = categories.find(
          (item) => item.slug === slug || item.id === slug
        );

        if (!foundCategory) {
  window.location.replace("/not-found");
  return;
}

        setCategory(foundCategory);
        setProducts(productData);
      } catch (err) {
        console.error("Category page error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadCategory();
    }
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortOption === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortOption === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortOption]);

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 h-28 animate-pulse rounded-2xl bg-gray-100" />

        <div className="mb-6 h-7 w-48 animate-pulse rounded bg-gray-100" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">🔎</div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mb-6 text-sm leading-6 text-gray-500">
            এই ক্যাটাগরির তথ্য লোড করা যায়নি। অন্য ক্যাটাগরি বেছে নাও অথবা
            হোম পেজে ফিরে যাও।
          </p>

          <Link
            href="/"
            className="inline-flex rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Category Header */}
        <section className="mb-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
                {category.icon}
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-emerald-700">
                  পণ্যের ক্যাটাগরি
                </p>

                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  {category.nameBn}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  এই ক্যাটাগরির পণ্যের বর্তমান বাজারদর দেখুন।
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <span>←</span>
              হোম পেজ
            </Link>
          </div>
        </section>

        {/* Products Heading and Sort */}
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {category.nameBn} এর সব পণ্য
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                মোট {products.length.toLocaleString("bn-BD")}টি পণ্য
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="product-sort"
                className="shrink-0 text-sm font-medium text-gray-600"
              >
                সাজান:
              </label>

              <select
                id="product-sort"
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
                className="min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low-to-high">দাম: কম থেকে বেশি</option>
                <option value="high-to-low">দাম: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
              <div className="mb-3 text-4xl">🛒</div>

              <h3 className="mb-2 text-lg font-bold text-gray-800">
                এই ক্যাটাগরিতে কোনো পণ্য নেই
              </h3>

              <p className="mb-5 text-sm text-gray-500">
                অন্য ক্যাটাগরি দেখো অথবা হোম পেজে ফিরে যাও।
              </p>

              <Link
                href="/"
                className="inline-flex rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}