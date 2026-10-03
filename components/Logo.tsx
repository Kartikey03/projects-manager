import Image from "next/image";

/**
 * The app icon. Pre-sized PNGs are served as-is (no image optimizer round-trip):
 * 64px covers the nav at 2x, 192px covers the large hero/login mark at 2x.
 */
export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  const src = size <= 32 ? "/brand/logo-64.png" : "/brand/icon-192.png";
  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt=""
      aria-hidden
      unoptimized
      priority
      className={`shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
