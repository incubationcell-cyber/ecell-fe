import Head from 'next/head';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Schema Component
 * Generates breadcrumb navigation schema for search engines
 * Helps with site navigation and improves SERP appearance
 */
export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </Head>
  );
};

/**
 * Helper component to render visual breadcrumbs + schema
 */
export const BreadcrumbNav = ({ items }: BreadcrumbSchemaProps) => {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav aria-label="breadcrumb" className="flex items-center space-x-2 text-sm mb-4">
        {items.map((item, index) => (
          <div key={item.url} className="flex items-center">
            <a href={item.url} className="text-blue-600 hover:underline">
              {item.name}
            </a>
            {index < items.length - 1 && <span className="mx-2 text-gray-500">/</span>}
          </div>
        ))}
      </nav>
    </>
  );
};