'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, AlertTriangle } from 'lucide-react';
import { SketchMetadata } from '@/app/types';
import { P5Wrapper } from './P5Wrapper';
import { wrapSketchCode } from '@/app/_lib/sketchUtils';
import { easing, duration } from '@/app/_lib/motion';
import { P5ErrorBoundary } from './P5ErrorBoundary';
import { useLazyLoad } from '@/app/_hooks/useLazyLoad';

interface SketchCardProps {
  sketch: SketchMetadata;
  onClick: (id: string) => void;
  className?: string;
  lazyDelay?: number;
}

function hasNoLoop(code: string | undefined): boolean {
  if (!code) return false;
  return /\bnoLoop\s*\(/.test(code);
}

export const SketchCard: React.FC<SketchCardProps> = ({ sketch, onClick, className, lazyDelay = 0 }) => {
  const { ref, shouldRender } = useLazyLoad(lazyDelay, '400px');
  const usesNoLoop = useMemo(() => hasNoLoop(sketch.code), [sketch.code]);

  const sketchFn = useMemo(() => {
    if (!sketch.code) return () => {};
    const baseSketch = wrapSketchCode(sketch.code);
    return (p: any) => {
      baseSketch(p);
      const originalDraw = p.draw;
      p.draw = () => {
        if (typeof originalDraw === 'function') originalDraw();
        p.noLoop();
      };
    };
  }, [sketch.code]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -6 }}
      transition={{ duration: duration.compact, ease: easing.standard }}
      className={`group cursor-pointer mb-4 bg-surface-container-low rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-surface-container-high overflow-hidden ${className}`}
      onClick={() => onClick(sketch.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-highest">
        {usesNoLoop && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 bg-amber-400/80 dark:bg-amber-600/80 rounded text-[0.6rem] font-mono-xs uppercase tracking-widest text-amber-900 dark:text-amber-50">
            <AlertTriangle className="w-3 h-3" />
            <span>noLoop</span>
          </div>
        )}
        {shouldRender ? (
          <div className="w-full h-full md:grayscale md:group-hover:grayscale-0 transition-all duration-700 p5-thumbnail-container">
            <P5ErrorBoundary>
              <P5Wrapper
                sketch={sketchFn}
                className="w-full h-full flex items-center justify-center scale-[0.5] origin-center"
                cdnUrls={sketch.cdnUrls}
                code={sketch.code}
                renderMode="instance"
              />
            </P5ErrorBoundary>
          </div>
        ) : (
          <div className="w-full h-full sketch-placeholder-bg animate-pulse" />
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ArrowUpRight className="w-5 h-5 text-on-surface" />
        </div>
      </div>

      <div className="flex flex-col space-y-1 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-mono text-base uppercase tracking-tight truncate max-w-[85%]">{sketch.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-sm bg-primary shrink-0"></span>
          <span className="font-mono-xs opacity-60 uppercase tracking-widest">{sketch.date}</span>
        </div>
      </div>
    </motion.div>
  );
};
