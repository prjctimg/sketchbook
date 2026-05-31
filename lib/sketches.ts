import { SketchMetadata } from '@/types';
import { fetchGistSketches } from '@/lib/gistService';

export async function getSketches(): Promise<SketchMetadata[]> {
  return fetchGistSketches();
}
