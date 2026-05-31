'use client';

import React from 'react';
import { Monitor, Moon, Sun, Github } from 'lucide-react';
import siteMeta from '@/sitemeta.json';

interface FooterProps {
  theme: string;
  setTheme: (t: 'system' | 'light' | 'dark') => void;
}

const WHAT_IS_SKETCHBOOK_URL = 'https://prjctimg.me/blg/on-keeping-a-sketchbook';
const AUTHOR_GITHUB_URL = `https://github.com/${siteMeta.github.username}`;

export const Footer: React.FC<FooterProps> = ({ theme, setTheme }) => {
  return (
    <footer className="px-base py-16 md:py-24 bg-surface text-on-surface border-t border-outline/10 rounded-t-xl">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-8">
        {/* Theme Toggle (Adaptive Style) */}
        <div className="flex bg-surface-container-highest border border-outline-variant p-1 rounded-full relative">
          <button
            onClick={() => setTheme('system')}
            className={`relative z-10 p-2 rounded-full transition-colors duration-200 ${theme === 'system' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="System"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`relative z-10 p-2 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="Dark"
          >
            <Moon size={16} />
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`relative z-10 p-2 rounded-full transition-colors duration-200 ${theme === 'light' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="Light"
          >
            <Sun size={16} />
          </button>

          {/* Active Indicator Backdrop */}
          <div
            className="absolute top-1 bottom-1 bg-surface-container-low border border-outline-variant rounded-full transition-all duration-200 ease-out z-0"
            style={{
              width: '32px',
              left: theme === 'system' ? '4px' : theme === 'dark' ? '36px' : '68px'
            }}
          />
        </div>

        {/* Build Info */}
        <div className="font-mono-sm tracking-tight opacity-90">
          build: {(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev').slice(0, 7)}
        </div>

        {/* Copyright Line */}
        <div className="flex items-center space-x-2 font-mono text-xs opacity-70 uppercase tracking-widest">
          <a href={WHAT_IS_SKETCHBOOK_URL} className="hover:text-primary transition-colors">What&apos;s a sketchbook ?</a>
          <span>·</span>
          <span>&copy; {new Date().getFullYear()},</span>
          <a href={AUTHOR_GITHUB_URL} className="hover:text-primary transition-colors">
            <Github size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};
