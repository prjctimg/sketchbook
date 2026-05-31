import type { Metadata } from 'next';
import { getSketches } from '@/lib/sketches';
import { SketchDetail } from '@/components/SketchDetail';
import { notFound } from 'next/navigation';
import siteMeta from '@/sitemeta.json';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sketches = await getSketches();
  const sketch = sketches.find(s => s.id === id);
  if (!sketch) return { title: 'Not Found' };

  return {
    title: `${sketch.title} | ${siteMeta.site.title}`,
    description: sketch.description,
    openGraph: {
      title: sketch.title,
      description: sketch.description,
      images: [{ url: sketch.thumbnail || siteMeta.site.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: sketch.title,
      description: sketch.description,
      images: [sketch.thumbnail || siteMeta.site.image],
    },
  };
}

export default async function SketchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sketches = await getSketches();
  const sketch = sketches.find(s => s.id === id);
  if (!sketch) notFound();

  const currentIndex = sketches.findIndex(s => s.id === id);
  const prevId = currentIndex > 0 ? sketches[currentIndex - 1].id : null;
  const nextId = currentIndex < sketches.length - 1 ? sketches[currentIndex + 1].id : null;

  return <SketchDetail sketch={sketch} prevId={prevId} nextId={nextId} />;
}
