'use client';

import { useState, useRef, useEffect } from 'react';

export function useLazyLoad(delay: number = 0, rootMargin: string = '200px') {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => {
            setShouldRender(true);
          }, delay);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, rootMargin]);

  return { ref, shouldRender };
}
