'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const SequentialRenderContext = createContext<number>(0);

export function SequentialRenderProvider({
  children,
  total,
  delay = 400,
}: {
  children: ReactNode;
  total: number;
  delay?: number;
}) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count >= total) return;
    const timer = setTimeout(() => setCount(c => c + 1), delay);
    return () => clearTimeout(timer);
  }, [count, total, delay]);

  return (
    <SequentialRenderContext.Provider value={count}>
      {children}
    </SequentialRenderContext.Provider>
  );
}

export function useSequentialRender(index: number) {
  const maxIndex = useContext(SequentialRenderContext);
  return index < maxIndex;
}
