import { SketchMetadata } from '@/types';
import { fetchGistSketches } from '@/lib/gistService';

export async function getSketches(): Promise<SketchMetadata[]> {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_SKETCHES_DIR) {
    const { loadLocalSketches } = await import('@/lib/localSketchLoader');
    return loadLocalSketches(process.env.DEV_SKETCHES_DIR);
  }
  return fetchGistSketches();
}
