const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = MONTHS[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function generateThumbnailFromId(id: string): string {
  const hash = id.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const seed = Math.abs(hash);
  return `https://picsum.photos/seed/${seed}/800/800`;
}

export function packageToCdnUrl(pkg: string): string | null {
  if (pkg.includes('/')) return `https://cdn.jsdelivr.net/npm/${pkg}`;
  return `https://unpkg.com/${pkg}`;
}
