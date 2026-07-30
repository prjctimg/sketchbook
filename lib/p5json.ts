export interface P5Json {
  libs?: Record<string, string>;
}

export interface P5JsonLibsResult {
  dependencies: string[];
  cdnUrls: string[];
}

export function loadP5JsonLibs(content: string): P5JsonLibsResult {
  const result: P5JsonLibsResult = { dependencies: [], cdnUrls: [] };
  try {
    const p5json: P5Json = JSON.parse(content);
    if (p5json.libs) {
      for (const [name, version] of Object.entries(p5json.libs)) {
        result.dependencies.push(name);
        result.cdnUrls.push(`https://cdn.jsdelivr.net/npm/${name}@${version}`);
      }
    }
  } catch (e) {
    console.warn('Failed to parse p5.json:', e);
  }
  return result;
}
