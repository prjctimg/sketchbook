'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/_components/Navbar';
import { Hero } from '@/app/_components/Hero';
import { SketchCard } from '@/app/_components/SketchCard';
import { SketchMetadata } from '@/app/types';
import { Footer } from '@/app/_components/Footer';

export default function HomeClient({ sketches }: { sketches: SketchMetadata[] }) {
  const router = useRouter();
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'system' | 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSketchClick = (id: string) => {
    router.push(`/sketch/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-grow"
      >
        <Hero />

        {sketches.length > 0 && (
          <section className="bg-surface-container-low px-base py-24 md:px-base lg:px-base mb-12 overflow-hidden border-b border-outline/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="lg:col-span-3 space-y-8"
              >
                <div className="mb-3">
                  <span className="font-mono-sm uppercase tracking-widest opacity-40 bg-tertiary-container px-3 py-1 text-on-surface font-normal rounded-lg">RECENT</span>
                </div>
                <h2 className="font-mono text-[2rem] md:text-[2rem] font-normal editorial-headline uppercase">
                  {sketches[0].title.split(' ').slice(0, 2).join(' ')}<br />
                  {sketches[0].title.split(' ').slice(2).join(' ')}
                </h2>
                <motion.button
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSketchClick(sketches[0].id)}
                  className="bg-primary text-on-primary font-mono-sm uppercase tracking-widest px-10 py-4 rounded-lg transition-opacity hover:opacity-90"
                >
                  Preview
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="lg:col-span-2 relative rounded-xl overflow-hidden"
              >
                <SketchCard sketch={sketches[0]} onClick={handleSketchClick} className="w-full h-full !mb-0 border-none pb-0" />
              </motion.div>
            </div>
          </section>
        )}

        <section className="px-base py-16 md:px-base lg:px-base mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10 border-b border-outline/10 pb-6">
              <h3 className="font-mono text-sm uppercase tracking-widest opacity-60">Gallery</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {sketches.length > 0 ? (
                <>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-8"
                  >
                    <SketchCard
                      sketch={sketches[0]}
                      onClick={handleSketchClick}
                    />
                  </motion.div>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-4 flex flex-col justify-end pb-8"
                  >
                    {sketches[1] && (
                      <SketchCard
                        sketch={sketches[1]}
                        onClick={handleSketchClick}
                      />
                    )}
                  </motion.div>

                  {sketches.slice(2).map((sketch, idx) => (
                    <motion.div
                      layout
                      key={sketch.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (idx % 3 + 1) }}
                      className="md:col-span-4"
                    >
                      <SketchCard
                        sketch={sketch}
                        onClick={handleSketchClick}
                      />
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="col-span-12 py-32 text-center border border-outline/20 rounded-xl">
                  <span className="font-mono text-xs opacity-40 uppercase tracking-widest">No active gists.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </motion.main>

      <Footer theme={theme} setTheme={setTheme} />
    </div>
  );
}
