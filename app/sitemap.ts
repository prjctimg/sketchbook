import { MetadataRoute } from 'next';
import siteMeta from '@/sitemeta.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMeta.site.url;
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ];
}
