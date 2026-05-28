import { getSketches } from '@/app/_data/sketches';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const sketches = await getSketches();
  return <HomeClient sketches={sketches} />;
}
