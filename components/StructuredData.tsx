'use client';

import { usePathname } from 'next/navigation';

export function BreadcrumbStructuredData() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zodiak.life';
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    ...pathSegments.map((segment, index) => {
      const url = `${baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { name, url };
    }),
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
