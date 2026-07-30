'use client';

import React, { useEffect, useState, useRef } from 'react';
import { NextReactP5Wrapper } from '@p5-wrapper/next';

interface P5WrapperProps {
  sketch?: (p: any) => void;
  className?: string;
  cdnUrls?: string[];
  code?: string;
}

let p5Ready: Promise<void> | null = null;

function ensureP5Ready(): Promise<void> {
  if (!p5Ready) {
    p5Ready = import('p5').then((m: any) => {
      const p5 = m.default || m;
      p5.disableFriendlyErrors = true;
    });
  }
  return p5Ready;
}

function parseCdnPackagesFromCode(code: string): string[] {
  if (!code) return [];
  const packages: string[] = [];
  const lines = code.split('\n');
  const depsPattern = [
    /^\/\/\s*deps:\s*(.+)$/i,
    /^\/\*\s*deps:\s*(.+?)\s*\*\/$/i,
  ];
  for (const line of lines) {
    const trimmed = line.trim();
    for (const pattern of depsPattern) {
      const match = trimmed.match(pattern);
      if (match) {
        const pkgs = match[1].split(',').map(p => p.trim()).filter(Boolean);
        packages.push(...pkgs);
      }
    }
  }
  return [...new Set(packages)];
}

function packageToCdnUrl(pkg: string): string | null {
  if (pkg.includes('/')) return `https://cdn.jsdelivr.net/npm/${pkg}`;
  return `https://unpkg.com/${pkg}`;
}

const P5_JS_RE = /\/p5(\.min)?\.js$/;

function getExternalUrls(cdnUrls: string[], code: string | undefined): string[] {
  const filtered = cdnUrls.filter(url => !P5_JS_RE.test(url));
  const codePackages = code ? parseCdnPackagesFromCode(code) : [];
  const codeCdnUrls = codePackages
    .map(pkg => packageToCdnUrl(pkg))
    .filter((url): url is string => url !== null);
  return [...new Set([...filtered, ...codeCdnUrls])];
}

export const P5Wrapper = React.memo(({ sketch, className, cdnUrls = [], code }: P5WrapperProps) => {
  const [ready, setReady] = useState(false);
  const [scriptsReady, setScriptsReady] = useState(false);
  const scriptElementsRef = useRef<HTMLScriptElement[]>([]);

  useEffect(() => {
    let cancelled = false;
    ensureP5Ready().then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const allUrls = getExternalUrls(cdnUrls, code);

    if (allUrls.length === 0) {
      setScriptsReady(true);
      return;
    }

    const loaded = new Set<string>();
    const created: HTMLScriptElement[] = [];

    for (const url of allUrls) {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${url}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          loaded.add(url);
        } else {
          const handler = () => { loaded.add(url); if (loaded.size === allUrls.length && !cancelled) setScriptsReady(true); };
          existing.addEventListener('load', handler, { once: true });
          existing.addEventListener('error', handler, { once: true });
        }
        continue;
      }
      const script = document.createElement('script');
      const handler = () => { script.dataset.loaded = 'true'; loaded.add(url); if (loaded.size === allUrls.length && !cancelled) setScriptsReady(true); };
      script.src = url;
      script.async = true;
      script.onload = handler;
      script.onerror = () => { console.warn(`[sketchbook] Failed to load ${url}`); handler(); };
      document.head.appendChild(script);
      created.push(script);
    }

    scriptElementsRef.current = created;

    if (loaded.size === allUrls.length && !cancelled) {
      setScriptsReady(true);
    }

    return () => {
      cancelled = true;
      for (const el of created) {
        el.remove();
      }
    };
  }, [cdnUrls, code]);

  if (!sketch) {
    return <div className={className} />;
  }

  if (!ready || !scriptsReady) {
    return <div className={`${className} sketch-placeholder-bg animate-pulse`} />;
  }

  return (
    <div className={className}>
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
});
