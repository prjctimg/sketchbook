'use client';

import React from 'react';
import { motion } from 'motion/react';
import siteMeta from '@/sitemeta.json';

const githubUrl = `https://github.com/${siteMeta.github.username}`;

export const Hero: React.FC = () => {
  return (
    <header className="px-base py-16 md:px-base lg:px-base mb-12 border-b border-outline/10 rounded-b-xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.0, 0, 0.2, 1] }}
        className="max-w-7xl mx-auto"
      >
        <p className="font-mono text-[1.5rem] leading-relaxed max-w-4xl mb-6 opacity-80">
          I am <a href={githubUrl} className="hover:text-primary transition-colors underline underline-offset-4 decoration-1">{siteMeta.github.username}</a>, keeper of this sketchbook (a collection of p5.js programs which are 'unsurprisingly' called sketches). Though all to be seen is already here, <a href={githubUrl} className="hover:text-primary transition-colors underline underline-offset-4 decoration-1">one can go to the list of sketches</a> for reference.

          <br />
          <br />

          This is a "breathing space" for creativity and nothing more, (please) treat it as such. Enjoy 🖼️!
        </p>
      </motion.div>
    </header>
  );
};
