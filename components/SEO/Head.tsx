import Head from 'next/head';
import { getOpenGraphMetaTags, getTwitterMetaTags, generateSchemaMarkup, SEOProps, DEFAULT_SEO } from '@/lib/seo';

interface HeadProps extends SEOProps {
  children?: React.ReactNode;
}

/**
 * SEO Head Component
 * Handles all meta tags, Open Graph, Twitter Cards, and schema markup
 * Usage: <SEOHead title="..." description="..." />
 */
export const SEOHead = ({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  author,
  publishedDate,
  updatedDate,
  children,
}: HeadProps) => {
  // Merge with defaults
  const mergedTitle = title || DEFAULT_SEO.title;
  const mergedDescription = description || DEFAULT_SEO.description;
  const mergedImage = image || 'https://e-cell.jeckukas.org.in/og-image.png'; // Add your OG image
  const mergedKeywords = keywords || DEFAULT_SEO.keywords;
  const mergedUrl = url || DEFAULT_SEO.url;

  // Generate meta objects
  const ogTags = getOpenGraphMetaTags({
    title: mergedTitle,
    description: mergedDescription,
    image: mergedImage,
    url: mergedUrl,
    type,
  });

  const twitterTags = getTwitterMetaTags({
    title: mergedTitle,
    description: mergedDescription,
    image: mergedImage,
  });

  const schemaMarkup = generateSchemaMarkup({
    title: mergedTitle,
    description: mergedDescription,
    image: mergedImage,
    url: mergedUrl,
    type,
    publishedDate,
    updatedDate,
    author,
  });

  return (
    <Head>
      {/* Basic SEO */}
      <title>{mergedTitle}</title>
      <meta name="description" content={mergedDescription} />
      <meta name="keywords" content={mergedKeywords} />
      <meta name="author" content={author || 'E-Cell JEC Team'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Canonical URL - Critical for duplicate content prevention */}
      <link rel="canonical" href={mergedUrl} />

      {/* Open Graph Tags - For social sharing */}
      {Object.entries(ogTags).map(([key, value]) => (
        <meta key={key} property={key} content={value as string} />
      ))}

      {/* Twitter Card Tags */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={key} name={key} content={value as string} />
      ))}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Structured Data (JSON-LD) - Critical for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />

      {/* Alternate Links for multilingual content (if applicable) */}
      <link rel="alternate" hrefLang="en-IN" href={mergedUrl} />
      <link rel="alternate" hrefLang="en" href={mergedUrl} />
      <link rel="alternate" hrefLang="x-default" href={mergedUrl} />

      {/* Additional SEO enhancements */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#ffffff" />

      {/* Custom children (if any additional meta tags needed) */}
      {children}
    </Head>
  );
};
