/**
 * SEO Utilities for E-Cell JEC Website
 * Handles meta tags, schema markup, and SEO optimization
 */

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
}

/**
 * Generate Open Graph meta tags for social sharing
 */
export const getOpenGraphMetaTags = (props: SEOProps) => {
  const { title, description, image, url = 'https://e-cell.jeckukas.org.in', type = 'website' } = props;

  return {
    'og:title': title,
    'og:description': description,
    'og:type': type,
    'og:url': url,
    ...(image && { 'og:image': image }),
    'og:site_name': 'E-Cell JEC Kukas',
  };
};

/**
 * Generate Twitter Card meta tags
 */
export const getTwitterMetaTags = (props: SEOProps) => {
  const { title, description, image } = props;

  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    ...(image && { 'twitter:image': image }),
    'twitter:site': '@ecell_jec',
  };
};

/**
 * Generate structured data (JSON-LD) for search engines
 */
export const generateSchemaMarkup = (props: SEOProps & { author?: string }) => {
  const { title, description, image, url = 'https://e-cell.jeckukas.org.in', type, publishedDate, updatedDate, author } = props;

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : type === 'profile' ? 'Person' : 'Organization',
    name: title,
    description: description,
    url: url,
    ...(image && { image: image }),
    ...(publishedDate && { datePublished: publishedDate }),
    ...(updatedDate && { dateModified: updatedDate }),
  };

  // Add organization-specific schema
  if (type === 'website' || !type) {
    return {
      ...baseSchema,
      '@type': 'Organization',
      alternateName: ['E-Cell', 'E-Cell Kukas', 'Entrepreneurship Cell JEC'],
      sameAs: [
        'https://www.facebook.com/ecell.jec',
        'https://www.instagram.com/ecell_jec',
        'https://twitter.com/ecell_jec',
        'https://www.linkedin.com/company/e-cell-jec',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        url: 'https://e-cell.jeckukas.org.in/contact',
      },
    };
  }

  if (type === 'article') {
    return {
      ...baseSchema,
      author: {
        '@type': 'Person',
        name: author || 'E-Cell Team',
      },
    };
  }

  return baseSchema;
};

/**
 * SEO keywords for E-Cell JEC
 */
export const SEO_KEYWORDS = {
  primary: [
    'E-Cell JEC',
    'E-Cell Kukas',
    'Entrepreneurship Cell',
    'JEC Kukas',
    'E Cell JEC',
    'E Cell Kukas',
    'Entrepreneurship JEC',
  ],
  secondary: [
    'startup community',
    'entrepreneurship',
    'innovation hub',
    'business development',
    'young entrepreneurs',
    'JEC Kukas entrepreneurship',
    'e-cell community',
  ],
  location: [
    'Kukas',
    'Jaipur',
    'Rajasthan',
    'JEC',
  ],
};

/**
 * Combine keywords for meta tags
 */
export const getCombinedKeywords = (): string => {
  return [
    ...SEO_KEYWORDS.primary,
    ...SEO_KEYWORDS.secondary,
    ...SEO_KEYWORDS.location,
  ].join(', ');
};

/**
 * Default SEO props for homepage
 */
export const DEFAULT_SEO: SEOProps = {
  title: 'E-Cell JEC Kukas - Entrepreneurship Cell | Startup Community',
  description: 'E-Cell JEC Kukas is the entrepreneurship cell at JEC. We foster innovation, support startups, and build a thriving community of young entrepreneurs.',
  url: 'https://e-cell.jeckukas.org.in',
  type: 'website',
  keywords: getCombinedKeywords(),
};
