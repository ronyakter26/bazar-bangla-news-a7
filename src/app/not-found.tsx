import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold text-green-700">
        404
      </h1>

      <h2 className="text-2xl font-semibold mt-4">
        পেজটি খুঁজে পাওয়া যায়নি!
      </h2>

      <p className="mt-2 text-gray-500">
        আপনি যে পেজটি খুঁজছেন, সেটি পাওয়া যাচ্ছে না।
      </p>

      <Link
        href="/"
        className="mt-6 rounded-lg bg-green-700 px-6 py-3 text-white hover:bg-green-800"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}