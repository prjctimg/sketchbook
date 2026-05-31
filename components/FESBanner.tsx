'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface FESBannerProps {
  code?: string;
}

function detectNoLoop(code: string): boolean {
  return /\bnoLoop\s*\(/.test(code);
}

export function NoLoopWarning({ code }: { code?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (!code || !detectNoLoop(code) || dismissed) return null;

  return (
    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs">
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
        This sketch uses <code className="font-mono text-amber-700 dark:text-amber-300">noLoop()</code>.
        If the initial render logic is heavy or improperly structured, the page may lag.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-0.5 rounded hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-amber-500" />
      </button>
    </div>
  );
}
