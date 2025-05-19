import { GetServerSideProps } from 'next';

const Sitemap = () => {
    return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const baseUrl = 'https://jowinjc.in';

    // Fetch dynamic routes or data
    const dynamicRoutes = [
        '/about',
        '/contact',
        '/blog/post-1',
        '/blog/post-2',
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <priority>1.0</priority>
    </url>
    ${dynamicRoutes
        .map((route) => {
            return `
        <url>
            <loc>${baseUrl}${route}</loc>
            <priority>0.8</priority>
        </url>
    `;
        })
        .join('')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default Sitemap;