import { useEffect, useRef } from "react";

type Params = {
  onIntersect: () => void;
  enabled?: boolean;
};

export function useInfiniteScroll({ onIntersect, enabled = true }: Params) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return { targetRef };
}
