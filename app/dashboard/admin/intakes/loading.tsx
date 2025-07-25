export default function IntakesLoading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Skeleton */}
      <header className="relative z-50 bg-gradient-to-r from-blue-600/10 to-cyan-400/10 backdrop-blur-md border-b border-blue-200/30">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          </nav>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="py-16 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-12">
            <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-12 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
              <div className="h-12 w-80 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-xl rounded-3xl p-6"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-3 animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="w-80 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Intakes Grid Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl border-2 border-gray-100/50 shadow-xl rounded-3xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div
                          key={j}
                          className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
                </div>

                <div className="px-6 pb-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>

                  <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>

                  <div className="flex space-x-2">
                    <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
