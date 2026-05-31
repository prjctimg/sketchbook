import { getSketches } from '@/lib/sketches';
import { SketchDetail } from '@/components/SketchDetail';
import { notFound } from 'next/navigation';

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
