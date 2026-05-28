'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SketchMetadata } from '@/app/types';
import { P5Wrapper } from './P5Wrapper';
import { wrapSketchCode } from '@/app/_lib/sketchUtils';

interface SketchCardProps {
  sketch: SketchMetadata;
  onClick: (id: string) => void;
  className?: string;
}

export const SketchCard: React.FC<SketchCardProps> = ({ sketch, onClick, className }) => {
  const sketchFn = useMemo(() => {
    if (!sketch.code) return () => {};
    const baseSketch = wrapSketchCode(sketch.code);
    return (p: any) => {
      baseSketch(p);
      const originalDraw = p.draw;
      p.draw = () => {
        if (originalDraw) originalDraw();
        p.noLoop();
      };
    };
  }, [sketch.code]);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group cursor-pointer mb-4 bg-surface-container-low rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-surface-container-high overflow-hidden ${className}`}
      onClick={() => onClick(sketch.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-highest">
        <div className="w-full h-full md:grayscale md:group-hover:grayscale-0 transition-all duration-700 p5-thumbnail-container">
          <P5Wrapper 
            sketch={sketchFn} 
            className="w-full h-full flex items-center justify-center scale-[0.5] origin-center"
            cdnUrls={sketch.cdnUrls}
            code={sketch.code}
          />
        </div>
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
