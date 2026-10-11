
import Link from "next/link";

export interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}

interface ProductCardProps {
  product: Product;
}

const toBn = (value: number) =>
  value.toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

export default function ProductCard({ product }: ProductCardProps) {
  const direction = product.change?.dir ?? "flat";

  const badgeColor =
    direction === "up"
      ? "bg-green-100 text-green-700"
      : direction === "down"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600";

  const arrow =
    direction === "up" ? "▲" : direction === "down" ? "▼" : "—";

  const unitName = unitNames[product.unit] ?? `প্রতি ${product.unit}`;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-2xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}
        >
                      {arrow} {toBn(product.change?.pct ?? 0)}%

        </span>
      </div>

      <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-green-700">
        {product.nameBn}
      </h3>

      <p className="mb-4 text-sm text-gray-500">
        {unitName}
      </p>

      <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
        <div>
          <p className="mb-1 text-xs text-gray-500">
            আজকের দাম
          </p>

          <p className="text-xl font-extrabold text-gray-900">
            {toBn(product.today)} টাকা
          </p>
        </div>

        <span className="text-sm font-medium text-green-700">
          {product.categoryNameBn}
        </span>
      </div>
    </Link>
  );
}
