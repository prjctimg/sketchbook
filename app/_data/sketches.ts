import { SketchMetadata } from '@/app/types';
import { fetchGistSketches } from '@/app/_lib/gistService';

export async function getSketches(): Promise<SketchMetadata[]> {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_SKETCHES_DIR) {
    const { loadLocalSketches } = await import('@/app/_lib/localSketchLoader');
    return loadLocalSketches(process.env.DEV_SKETCHES_DIR);
  }
  return fetchGistSketches();
}
