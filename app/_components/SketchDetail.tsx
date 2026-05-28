'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Github, Code as CodeIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { SketchMetadata } from '@/app/types';
import { P5Wrapper } from './P5Wrapper';
import { wrapSketchCode } from '@/app/_lib/sketchUtils';
import { P5_API_SYMBOLS, findUsedP5Symbols, type P5ApiCategory } from '@/app/_lib/p5ApiSymbols';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Markdown, { Components } from 'react-markdown';

const markdownComponents: Components = {
  a: ({ node, ...props }) => (
    <a {...props} className="text-blue-500 hover:text-blue-700 underline" />
  ),
};

interface SketchDetailProps {
  sketch: SketchMetadata;
  prevId: string | null;
  nextId: string | null;
}

export const SketchDetail: React.FC<SketchDetailProps> = ({ sketch, prevId, nextId }) => {
  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);

  const handleBack = useCallback(() => router.push('/'), [router]);
  const handlePrev = useCallback(() => { if (prevId) router.push(`/sketch/${prevId}`); }, [prevId, router]);
  const handleNext = useCallback(() => { if (nextId) router.push(`/sketch/${nextId}`); }, [nextId, router]);
  const [showCode, setShowCode] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedCode, setEditedCode] = useState(sketch.code ?? '');
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [activeCode, setActiveCode] = useState(sketch.code ?? '');

  const sketchFn = useMemo(
    () => activeCode ? wrapSketchCode(activeCode) : (p: any) => { },
    [activeCode]
  );

  useEffect(() => {
    setEditedCode(sketch.code ?? '');
    setActiveCode(sketch.code ?? '');
    setReloadKey(prev => prev + 1);
  }, [sketch.code]);

  const usedSymbols = useMemo(
    () => sketch.code ? findUsedP5Symbols(sketch.code) : [],
    [sketch.code]
  );

  const groupedSymbols: [string, { name: string; category: string }[]][] = useMemo(() => {
    const map = new Map<string, { name: string; category: string }[]>();
    for (const sym of usedSymbols) {
      const existing = map.get(sym.category);
      if (existing) {
        existing.push(sym);
      } else {
        map.set(sym.category, [sym]);
      }
    }
    return Array.from(map.entries());
  }, [usedSymbols]);

  const totalSymbols = usedSymbols.length;

  const handleReload = useCallback(() => {
    setReloadKey(prev => prev + 1);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await canvasContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const runCode = useCallback(() => {
    setActiveCode(editedCode);
    setReloadKey(prev => prev + 1);
  }, [editedCode]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="px-base py-8 flex flex-col md:flex-row md:items-start max-w-[1600px] mx-auto">
        {/* Sidebar / Navigation */}
        <div className="md:w-1/12 mb-8 md:mb-0 flex flex-col space-y-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 font-mono-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Gallery</span>
          </button>
          {(!!prevId || !!nextId) && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrev}
                disabled={!!!prevId}
                className={`flex items-center space-x-1 font-mono-xs uppercase tracking-widest transition-opacity rounded-lg ${!!prevId ? 'opacity-60 hover:opacity-100' : 'opacity-20 cursor-not-allowed'}`}
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Prev</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!!!nextId}
                className={`flex items-center space-x-1 font-mono-xs uppercase tracking-widest transition-opacity rounded-lg ${!!nextId ? 'opacity-60 hover:opacity-100' : 'opacity-20 cursor-not-allowed'}`}
              >
                <span>Next</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="md:w-11/12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 flex justify-between items-end mb-4 border-b border-outline/10 pb-4"
          >
            <h2 className="font-mono text-2xl lg:text-4xl font-medium tracking-tighter uppercase">{sketch.title}</h2>
            <div className="text-right">
              <span className="font-mono-xs uppercase tracking-widest opacity-40 block mb-1">sketched on</span>
              <span className="font-mono-sm font-medium">{sketch.date}</span>
            </div>
          </motion.div>

          <div className="lg:col-span-4 hidden lg:block" />

          {/* Sketch Canvas Container */}
          <div className="lg:col-span-8 space-y-4">
            <div
              ref={canvasContainerRef}
              className="aspect-square bg-surface-container-highest relative overflow-hidden rounded-xl shadow-sm"
            >
              <P5Wrapper
                key={reloadKey}
                sketch={sketchFn}
                className="w-full h-full flex items-center justify-center p5-canvas-container"
                cdnUrls={sketch.cdnUrls}
                code={sketch.code}
              />

              {/* Controls Overlaid on Canvas */}
              <div className="absolute bottom-6 right-6 flex space-x-2">
                <button
                  onClick={handleReload}
                  className="bg-surface-container-lowest border border-outline/20 px-4 py-2 flex items-center space-x-2 font-mono-sm uppercase tracking-widest rounded-lg transition-colors hover:bg-surface-container-high"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="bg-surface-container-lowest border border-outline/20 px-4 py-2 flex items-center space-x-2 font-mono-sm uppercase tracking-widest rounded-lg transition-colors hover:bg-surface-container-high"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span>Minimize</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span>Fullscreen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* In-page Code Viewer with CodeMirror */}
            <AnimatePresence>
              {showCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="border border-outline/10 bg-surface-container overflow-hidden rounded-xl"
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-outline/10 bg-surface-container">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono-sm uppercase tracking-widest opacity-60">Source</span>
                      <span className="font-mono-xs uppercase tracking-widest opacity-40">|</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={runCode}
                        className="font-mono-xs uppercase tracking-widest px-3 py-1.5 bg-primary text-on-primary transition-colors hover:bg-primary/90"
                      >
                        Play
                      </button>
                      <button onClick={() => setShowCode(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                        <ChevronUp size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <CodeMirror
                      value={editedCode}
                      height="500px"
                      theme="dark"
                      extensions={[javascript()]}
                      onChange={(value) => setEditedCode(value)}
                      className="text-sm"
                      basicSetup={{
                        lineNumbers: true,
                        foldGutter: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <section>
              <div className="mb-4">
                <span className="bg-primary-container text-primary font-mono-sm uppercase tracking-widest font-medium px-3 py-1 rounded-lg">Description</span>
              </div>
              <div className="font-mono leading-relaxed opacity-80 text-justify">
                <Markdown components={markdownComponents}>{sketch.description}</Markdown>
              </div>
            </section>

            {/* Technical Details - Collapsible */}
            <section className="pt-6 border-t border-outline/10">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="w-full flex items-center justify-between py-2 group"
              >
                <span className="font-mono-xs uppercase tracking-widest opacity-40 group-hover:opacity-60 transition-opacity">
                  Technical Details
                  {totalSymbols > 0 && (
                    <span className="ml-2 font-mono-xs opacity-40">{totalSymbols} symbols</span>
                  )}
                </span>
                <motion.div
                  animate={{ rotate: showTechDetails ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-4 h-4 opacity-40" />
                </motion.div>
              </motion.button>

              <AnimatePresence initial={false}>
                {showTechDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-6">
                      <div className="grid grid-cols-2 gap-y-5">
                        <div>
                          <span className="font-mono-xs uppercase tracking-widest opacity-40 block">Rendering mode</span>
                          <span className="font-mono-sm">{sketch.technicalDetails.rendering}</span>
                        </div>
                        <div>
                          <span className="font-mono-xs uppercase tracking-widest opacity-40 block">Uses</span>
                          <span className="font-mono-sm">{sketch.technicalDetails.dependencies.join(', ')}</span>
                        </div>
                      </div>

                      {groupedSymbols.length > 0 && (
                        <div className="border-t border-outline/10 pt-5">
                          <span className="font-mono-xs uppercase tracking-widest opacity-40 block mb-3">Symbols</span>
                          <div className="space-y-3">
                            {groupedSymbols.map(([category, symbols]) => (
                              <div key={category}>
                                <span className="font-mono-xs uppercase tracking-widest opacity-30 block mb-1.5">{category}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {symbols.map((sym) => (
                                    <a
                                      key={sym.name}
                                      href={`https://p5js.org/reference/#/p5/${sym.name}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-mono-xs px-2 py-1 bg-surface-container-highest hover:bg-primary-container hover:text-primary transition-colors rounded"
                                    >
                                      {sym.name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <section className="space-y-3 pt-6 border-t border-outline/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sketch.gistUrl && window.open(sketch.gistUrl, '_blank')}
                className="w-full bg-primary text-on-primary font-mono-sm uppercase tracking-widest py-4 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center space-x-2"
              >
                <Github size={16} />
                <span>Source</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCode(!showCode)}
                className={`w-full font-mono-sm uppercase tracking-widest py-4 rounded-lg transition-all flex items-center justify-center space-x-2 border ${showCode
                  ? 'bg-on-surface text-surface border-on-surface'
                  : 'bg-transparent text-on-surface border-outline hover:bg-on-surface hover:text-surface'
                  }`}
              >
                <CodeIcon size={16} />
                <span>{showCode ? 'Hide' : 'View'}</span>
              </motion.button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
