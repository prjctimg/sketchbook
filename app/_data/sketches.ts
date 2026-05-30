import { SketchMetadata } from '@/app/types';
import { fetchGistSketches } from '@/app/_lib/gistService';

export async function getSketches(): Promise<SketchMetadata[]> {

  return fetchGistSketches();
}
