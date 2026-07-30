import { SketchMetadata } from '@/types';
import siteMeta from '@/sitemeta.json';
import { loadP5JsonLibs } from './p5json';
import { formatDate, generateThumbnailFromId, packageToCdnUrl } from './utils';

interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
}

interface Gist {
  url: string;
  id: string;
  description: string | null;
  public: boolean;
  created_at: string;
  updated_at: string;
  html_url: string;
  files: Record<string, GistFile>;
}

interface GistComment {
  body: string;
  user: {
    login: string;
  };
}

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USER = siteMeta.github.username;

async function fetchGists(): Promise<Gist[]> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USER}/gists?per_page=100`);
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      console.error('[sketchbook] GitHub API rate limited. Try again later or set a GITHUB_TOKEN.');
    }
    throw new Error(`Failed to fetch gists: ${response.status}`);
  }
  return response.json();
}

async function fetchGistComments(gistId: string): Promise<GistComment[]> {
  const response = await fetch(`${GITHUB_API_BASE}/gists/${gistId}/comments`);
  if (!response.ok) {
    return [];
  }
  const comments = await response.json();
  return comments.filter((c: GistComment) => c.user.login === GITHUB_USER);
}

function getFirstCommentText(comments: GistComment[]): string | null {
  const firstComment = comments[0];
  return firstComment?.body || null;
}

function generateTitleFromDescription(description: string | null, gistId: string): string {
  if (!description || description.trim() === '') {
    return `SKETCH_${gistId.slice(0, 8).toUpperCase()}`;
  }
  const firstLine = description.split('\n')[0].trim();
  if (firstLine.length > 50) {
    return firstLine.slice(0, 50).toUpperCase() + '...';
  }
  return firstLine.toUpperCase();
}

async function fetchSketchCode(rawUrl: string): Promise<string> {
  const response = await fetch(rawUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sketch code: ${response.status}`);
  }
  return response.text();
}

function extractNpmDependencies(code: string): string[] {
  const deps: string[] = [];
  const patterns = [
    /^\/\/\s*deps:\s*(.+)$/im,
    /\/\*\s*deps:\s*(.+?)\s*\*\/$/i,
  ];
  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) {
      const pkgs = match[1].split(',').map(p => p.trim()).filter(Boolean);
      deps.push(...pkgs);
    }
  }
  return [...new Set(deps)];
}

export async function fetchGistSketches(): Promise<SketchMetadata[]> {
  const gists = await fetchGists();
  const gistPromises = gists
    .filter(gist => gist.files['sketch.js'])
    .map(async (gist) => {
      const sketchFile = gist.files['sketch.js'];

      let code: string | undefined;
      try {
        code = await fetchSketchCode(sketchFile.raw_url);
      } catch (e) {
        console.warn(`Failed to fetch code for gist ${gist.id}:`, e);
      }

      const [comments, p5jsonContent] = await Promise.all([
        fetchGistComments(gist.id),
        gist.files['p5.json']
          ? fetchSketchCode(gist.files['p5.json'].raw_url)
          : Promise.resolve(undefined)
      ]);

      const firstComment = getFirstCommentText(comments);

      const descParts: string[] = [];
      if (gist.description) descParts.push(gist.description);
      if (firstComment && gist.description) descParts.push(firstComment);
      const description = descParts.length > 0 ? descParts.join('\n\n') : 'No description';

      let cdnUrls: string[] = [];

      let thumbnail = generateThumbnailFromId(gist.id);
      const thumbPng = gist.files['thumbnail.png'];
      const thumbJpg = gist.files['thumbnail.jpg'] || gist.files['thumbnail.jpeg'];
      if (thumbPng) {
        thumbnail = thumbPng.raw_url;
      } else if (thumbJpg) {
        thumbnail = thumbJpg.raw_url;
      }

      const dependencies = ['p5.js'];
      if (code) {
        const npmDeps = extractNpmDependencies(code);
        for (const dep of npmDeps) {
          if (!dependencies.includes(dep)) dependencies.push(dep);
          const url = packageToCdnUrl(dep);
          if (url && !cdnUrls.includes(url)) cdnUrls.push(url);
        }
      }

      if (p5jsonContent) {
        const p5Libs = loadP5JsonLibs(p5jsonContent);
        for (const dep of p5Libs.dependencies) {
          if (!dependencies.includes(dep)) dependencies.push(dep);
        }
        for (const url of p5Libs.cdnUrls) {
          if (!cdnUrls.includes(url)) cdnUrls.push(url);
        }
      }

      return {
        id: gist.id,
        title: generateTitleFromDescription(gist.description, gist.id),
        description,
        date: formatDate(gist.created_at),
        tags: [] as string[],
        thumbnail,
        technicalDetails: {
          rendering: 'CANVAS 2D',
          dependencies,
        },
        gistUrl: gist.html_url,
        code,
        cdnUrls
      };
    });

  const results = await Promise.all(gistPromises);
  const validGists = results.filter(Boolean) as SketchMetadata[];

  return validGists;
}
