export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-8 w-56 animate-pulse rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border p-4"
          >
            <div className="mb-4 h-40 rounded-lg bg-gray-200" />
            <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
            <div className="mb-4 h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-9 rounded-lg bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}