
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";

type SortValue = "default" | "low-to-high" | "high-to-low";

export default function TrendingProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortValue, setSortValue] = useState<SortValue>("default");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি");
        }

        const result = await response.json();
        console.log("API response:", result);
        console.log("Product count:", Array.isArray(result) ? result.length : result.data?.length);

        const products: Product[] = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.products)
              ? result.products
              : [];

        setAllProducts(products);
        console.log("Products set to state:", products.length);
      } catch {
        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const risers = useMemo(
    () =>
      allProducts
        .filter((product) => product.change?.dir === "up")
        .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
        .slice(0, 6),
    [allProducts]
  );

  const fallers = useMemo(
    () =>
      allProducts
        .filter((product) => product.change?.dir === "down")
        .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
        .slice(0, 6),
    [allProducts]
  );

  const sortedProducts = useMemo(() => {
    const currentList = [...allProducts];

    if (sortValue === "low-to-high") {
      currentList.sort((a, b) => a.today - b.today);
    } else if (sortValue === "high-to-low") {
      currentList.sort((a, b) => b.today - a.today);
    }

    return currentList;
  }, [allProducts, sortValue]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-400">
        পণ্যের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        কোনো পণ্যের তথ্য পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      {/* Section A — আজ দাম বেড়েছে */}
      <section>
        <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl text-red-600">▲</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              আজ দাম বেড়েছে
            </h2>
            
          </div>
        </div>

        {risers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {risers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-gray-500">
            দাম বেড়েছে এমন কোনো পণ্য নেই।
          </p>
        )}
      </section>

      {/* Section B — আজ দাম কমেছে */}
      <section>
        <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl text-green-600">▼</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              আজ দাম কমেছে
            </h2>
          </div>
        </div>

        {fallers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-gray-500">
            দাম কমেছে এমন কোনো পণ্য নেই।
          </p>
        )}
      </section>

      {/* Section C — সব পণ্য */}
      <section id="সব-পণ্য" className="scroll-mt-40 pt-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">

              সব পণ্য
            </h2>
            <p className="mt-1 text-sm text-gray-500">
  মোট {sortedProducts.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
</p>
          </div>

          <select
            value={sortValue}
            onChange={(event) =>
              setSortValue(event.target.value as SortValue)
            }
            aria-label="পণ্যের দাম অনুযায়ী সাজান"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-green-600 sm:w-64"
          >
            <option value="default">সাজান: ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
