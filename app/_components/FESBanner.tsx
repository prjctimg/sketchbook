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

interface FESMessage {
  id: number;
  text: string;
  type: 'warn' | 'error';
}

let fesIdCounter = 0;
const fesListeners: Set<(msg: FESMessage) => void> = new Set();

export function captureFES(type: 'warn' | 'error', text: string) {
  const msg: FESMessage = { id: ++fesIdCounter, text, type };
  fesListeners.forEach(fn => fn(msg));
}

export function FESToast() {
  const [messages, setMessages] = useState<FESMessage[]>([]);

  useEffect(() => {
    const handler = (msg: FESMessage) => {
      setMessages(prev => {
        const next = [...prev, msg];
        return next.length > 5 ? next.slice(-5) : next;
      });
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== msg.id));
      }, 8000);
    };
    fesListeners.add(handler);
    return () => { fesListeners.delete(handler); };
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex items-start gap-2 p-3 rounded-lg shadow-lg border text-sm ${
            msg.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{msg.text}</span>
          <button
            onClick={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
            className="shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
