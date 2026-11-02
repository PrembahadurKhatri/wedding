"use client";

import { useEffect, useRef, useState } from "react";

const roseDrops = ["left", "right", "left", "right", "left", "right"] as const;

export default function ScrollRosefall() {
  const [isScrolling, setIsScrolling] = useState(false);
  const stopTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function handleScroll() {
      setIsScrolling(true);
      if (stopTimer.current !== null) window.clearTimeout(stopTimer.current);
      stopTimer.current = window.setTimeout(() => {
        setIsScrolling(false);
        stopTimer.current = null;
      }, 800);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (stopTimer.current !== null) window.clearTimeout(stopTimer.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`scroll-rosefall${isScrolling ? " scroll-rosefall--active" : ""}`}
    >
      {roseDrops.map((rose, index) => (
        <svg
          className={`scroll-rosefall__rose scroll-rosefall__rose--${rose}`}
          key={`${rose}-${index}`}
          viewBox="0 0 64 78"
        >
          <path d="M30 46c-5 10-7 19-6 28h13c1-10-1-20-7-28Z" fill="#466346" />
          <path d="M27 63c-8-9-15-9-20-5 5 9 11 12 20 11M36 58c7-10 14-10 19-6-5 9-10 13-19 12" fill="#66835b" />
          <path d="M31 7c-4 6-14 8-15 18-1 11 7 19 16 20 9-1 17-9 16-20C47 15 36 13 31 7Z" fill="#8f263d" />
          <path d="M32 12c-7 5-10 10-8 16 1 5 5 8 8 10 3-2 7-5 8-10 2-6-1-11-8-16Z" fill="#c44752" />
          <path d="M32 18c-4 3-5 6-4 9 1 2 3 4 4 5 2-1 4-3 5-5 1-3 0-6-5-9Z" fill="#ef9a83" />
          <path d="M18 22c-3 6-1 13 5 18M46 22c3 6 1 13-5 18" fill="none" stroke="#e9b092" strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}
