/** Placeholder shown the instant a tab is tapped, while the server streams the real page. */
function Bone({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function PageSkeleton({ tiles = 4, rows = 4 }: { tiles?: number; rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Bone className="h-10 w-48 sm:h-12" />
          <Bone className="mt-3 h-4 w-64" />
        </div>
        <Bone className="h-10 w-40 rounded-full" />
      </div>

      {tiles > 0 && (
        <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${tiles > 2 ? "lg:grid-cols-4" : ""}`}>
          {Array.from({ length: tiles }).map((_, i) => (
            <div key={i} className="card p-5 sm:p-6">
              <Bone className="h-3.5 w-20" />
              <Bone className="mt-3 h-8 w-28" />
              <Bone className="mt-2 h-3 w-14" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Bone className="mb-3 ml-1 h-5 w-40" />
        <div className="card divide-y" style={{ borderColor: "var(--hairline)" }}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="px-5 py-4" style={{ borderColor: "var(--hairline)" }}>
              <div className="flex justify-between gap-4">
                <Bone className="h-4 w-2/5" />
                <Bone className="h-4 w-16" />
              </div>
              <Bone className="mt-2 h-3 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl" aria-busy="true" aria-label="Loading">
      <Bone className="mb-5 h-4 w-20" />
      <Bone className="h-7 w-28 rounded-full" />
      <Bone className="mt-4 h-10 w-3/4" />
      <Bone className="mt-4 h-4 w-1/2" />
      <div className="card mt-8 p-5 sm:p-7">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Bone className="h-3 w-14" />
              <Bone className="mt-2 h-7 w-24" />
            </div>
          ))}
        </div>
        <Bone className="mt-6 h-1 w-full" />
      </div>
    </div>
  );
}
