'use client';

import React, { useEffect, useRef } from 'react';
import { NextReactP5Wrapper } from '@p5-wrapper/next';

interface P5WrapperProps {
  sketch?: (p: any) => void;
  className?: string;
  cdnUrls?: string[];
  code?: string;
  renderMode?: 'auto' | 'instance' | 'global';
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(s);
  });
}

function GlobalSketch({ code, cdnUrls = [], className }: {
  code: string;
  cdnUrls?: string[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<any>(null);

  useEffect(() => {
    if (!code) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    (async () => {
      const deps = cdnUrls.filter(url => !/p5(\.min)?\.js/.test(url));
      for (const url of deps) {
        try { await loadScript(url); } catch (e) {
          console.warn('Failed to load dep:', url, e);
        }
      }
      if (cancelled) return;

      container.innerHTML = '';
      const script = document.createElement('script');
      script.textContent = code;
      container.appendChild(script);

      const { default: p5 } = await import('p5') as any;
      p5Ref.current = new p5();
    })();

    return () => {
      cancelled = true;
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, [code, cdnUrls]);

  return <div ref={containerRef} className={className} />;
}

function isGlobalMode(code: string): boolean {
  return /\bfunction\s+(setup|draw|preload)\s*\(/m.test(code) &&
         !/\bconst\s+sketch\s*=\s*(\(|function)/.test(code);
}

export const P5Wrapper = ({ sketch, className, cdnUrls = [], code, renderMode = 'auto' }: P5WrapperProps) => {
  const useGlobal = renderMode === 'global' || (renderMode === 'auto' && !!code && isGlobalMode(code));

  useEffect(() => {
    if (useGlobal) return;
    const urls = cdnUrls.filter(url => !/p5(\.min)?\.js/.test(url));
    for (const url of urls) {
      loadScript(url).catch(e => console.warn('Failed to load CDN script:', url, e));
    }
  }, [useGlobal, cdnUrls]);

  if (useGlobal && code) {
    return <GlobalSketch code={code} cdnUrls={cdnUrls} className={className} />;
  }

  if (!sketch) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <NextReactP5Wrapper sketch={sketch} />
    </div>
  );
};
