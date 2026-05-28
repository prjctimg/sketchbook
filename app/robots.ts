import { MetadataRoute } from 'next';
import siteMeta from '@/sitemeta.json';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMeta.site.url}/sitemap.xml`,
  };
}
