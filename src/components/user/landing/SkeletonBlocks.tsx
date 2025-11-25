export default function SkeletonBlocks() {
  return (
    <div className="animate-pulse space-y-8 p-4">

      {/* Hero Banner */}
      <div className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800" />

      {/* Featured Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-28 rounded-full bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-52 rounded-xl bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>
    </div>
  );
}
