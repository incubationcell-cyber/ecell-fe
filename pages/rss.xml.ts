import { GetServerSideProps } from 'next';

const DOMAIN = 'https://e-cell.jeckukas.org.in';

const generateRssFeed = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
        <title>E-Cell JEC Kukas - Blog Feed</title>
        <link>${DOMAIN}</link>
        <description>Latest news and updates from E-Cell JEC Kukas - Entrepreneurship Cell</description>
        <language>en-us</language>
        <managingEditor>contact@e-cell.jeckukas.org.in</managingEditor>
        <webMaster>contact@e-cell.jeckukas.org.in</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <ttl>3600</ttl>
        
        <!-- Add blog posts dynamically here -->
        <item>
          <title>Welcome to E-Cell JEC</title>
          <link>${DOMAIN}/blog/welcome</link>
          <guid isPermaLink="true">${DOMAIN}/blog/welcome</guid>
          <pubDate>${new Date().toUTCString()}</pubDate>
          <description>Welcome to E-Cell JEC Kukas - Entrepreneurship Cell</description>
          <content:encoded>
            Welcome to E-Cell JEC Kukas. Join us in our mission to foster entrepreneurship.
          </content:encoded>
        </item>
      </channel>
    </rss>`;
};

function RSS() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = generateRssFeed();

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(rss);
  res.end();

  return {
    props: {},
  };
};

export default RSS;
