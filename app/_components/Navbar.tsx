'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center w-full px-base h-20 bg-surface-container-low sticky top-0 z-50 shadow-sm rounded-b-xl">
      <Link href="/">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="font-sans text-2xl font-[900] tracking-tighter cursor-pointer lowercase"
        >
          skchbk
        </motion.div>
      </Link>
    </nav>
  );
};
