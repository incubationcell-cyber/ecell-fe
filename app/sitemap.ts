import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://e-cell.jeckukas.org.in'
  const lastmod = new Date('2026-06-19')

  return [
    {
      url: baseUrl,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastmod,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: lastmod,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastmod,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ]
}
