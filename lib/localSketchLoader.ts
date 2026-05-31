import { promises as fs } from 'fs';
import path from 'path';
import { SketchMetadata } from '@/types';
import { loadP5JsonLibs } from './p5json';
import { formatDate, generateThumbnailFromId, packageToCdnUrl } from './utils';

export async function loadLocalSketches(dirPath: string): Promise<SketchMetadata[]> {
  const resolved = path.resolve(dirPath);
  let entries;
  try {
    entries = await fs.readdir(resolved, { withFileTypes: true });
  } catch {
    console.warn(`Dev sketches directory not found: ${resolved}`);
    return [];
  }

  const p5JsonPath = path.join(resolved, 'p5.json');
  let globalLibs: { dependencies: string[]; cdnUrls: string[] } | null = null;
  try {
    const p5Content = await fs.readFile(p5JsonPath, 'utf-8');
    globalLibs = loadP5JsonLibs(p5Content);
  } catch {
  }

  const files = entries
    .filter(e => e.isFile() && e.name.endsWith('.js'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sketches: SketchMetadata[] = [];

  for (const file of files) {
    const id = file.name.replace(/\.js$/, '');
    const filePath = path.join(resolved, file.name);
    let code: string;
    let mtime: Date;
    try {
      code = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      mtime = stats.mtime;
    } catch (e) {
      console.warn(`Failed to read dev sketch ${file.name}:`, e);
      continue;
    }

    const depsMatch = code.match(/^\/\/\s*deps:\s*(.+)$/im);
    const dependencies = ['p5.js'];
    const cdnUrls: string[] = [];
    if (depsMatch) {
      const pkgs = depsMatch[1].split(',').map(p => p.trim()).filter(Boolean);
      for (const pkg of pkgs) {
        if (!dependencies.includes(pkg)) dependencies.push(pkg);
        const url = packageToCdnUrl(pkg);
        if (url) cdnUrls.push(url);
      }
    }

    if (globalLibs) {
      for (const dep of globalLibs.dependencies) {
        if (!dependencies.includes(dep)) dependencies.push(dep);
      }
      for (const url of globalLibs.cdnUrls) {
        if (!cdnUrls.includes(url)) cdnUrls.push(url);
      }
    }

    sketches.push({
      id,
      title: id.toUpperCase(),
      description: '',
      date: formatDate(mtime),
      tags: ['DEV'],
      thumbnail: generateThumbnailFromId(id),
      technicalDetails: {
        rendering: 'CANVAS 2D',
        dependencies,
      },
      code,
      cdnUrls,
    });
  }

  return sketches;
}
