'use client';

import React, { useEffect } from 'react';
import { NextReactP5Wrapper } from '@p5-wrapper/next';

interface P5WrapperProps {
  sketch?: (p: any) => void;
  className?: string;
  cdnUrls?: string[];
  code?: string;
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
  const jsdelivr = `https://cdn.jsdelivr.net/npm/${pkg}`;
  const unpkg = `https://unpkg.com/${pkg}`;

  if (pkg.includes('/')) {
    return jsdelivr;
  }

  return unpkg;
}

export const P5Wrapper = React.memo(({ sketch, className, cdnUrls = [], code }: P5WrapperProps) => {
  useEffect(() => {
    import('p5').then((m: any) => {
      const p5 = m.default || m;
      p5.disableFriendlyErrors = true;
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const externalUrls = cdnUrls.filter(
      url => !url.includes('p5.js') && !url.includes('p5.min.js')
    );

    const codePackages = code ? parseCdnPackagesFromCode(code) : [];

    const codeCdnUrls = codePackages
      .map(pkg => packageToCdnUrl(pkg))
      .filter((url): url is string => url !== null);

    const allCdnUrls = [...new Set([...externalUrls, ...codeCdnUrls])];

    for (const url of allCdnUrls) {
      if (!document.querySelector(`script[src="${url}"]`)) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onerror = () => console.warn(`Failed to load ${url}`);
        document.head.appendChild(script);
      }
    }
  }, [cdnUrls, code]);

  if (!sketch) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
});
