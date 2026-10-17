import type { MetadataRoute } from 'next';
import { SITIO } from '@/content/sitio';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${SITIO.url}/sitemap.xml`,
  };
}
