'use client';

import Image from 'next/image';

export function ZodiakLogo({ size = 200 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src="/logo.png"
        alt="Zodiak Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
}
