import { GetServerSideProps } from 'next';

const DOMAIN = 'https://e-cell.jeckukas.org.in';

// Define all static pages
const PAGES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/events',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/team',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: '0.8',
  },
];

const generateSiteMap = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${PAGES.map(({ path, changefreq, priority }) => {
        return `
        <url>
          <loc>${`${DOMAIN}${path}`}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
        `;
      })
        .join('')}
    </urlset>`;
};

function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
