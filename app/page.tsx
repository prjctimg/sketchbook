import { getSketches } from '@/lib/sketches';
import HomeClient from '@/components/layout/HomeClient';

export default async function HomePage() {
  const sketches = await getSketches();
  return <HomeClient sketches={sketches} />;
}
