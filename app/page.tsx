import { fetchGistSketches } from '@/lib/gistService';
import HomeClient from '@/components/layout/HomeClient';

export default async function HomePage() {
  const sketches = await fetchGistSketches();
  return <HomeClient sketches={sketches} />;
}
