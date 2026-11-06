"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Small red hearts that drift down both screen edges while the guest scrolls, twinkling as they fall.
// side, offset from the edge (vw), size (px), delay (s), fall duration (s)
const hearts = [
  ["left", 3, 14, 0, 3.2],
  ["right", 3, 11, 0.3, 3.5],
  ["left", 8, 9, 0.7, 3.8],
  ["right", 8, 15, 0.15, 3.4],
  ["left", 1.5, 10, 1.1, 3.6],
  ["right", 1.5, 9, 0.85, 3.9],
  ["left", 5, 12, 1.6, 3.3],
  ["right", 5.5, 10, 1.35, 3.7],
] as const;

export default function ScrollHeartfall() {
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
    <div aria-hidden="true" className={`heartfall${isScrolling ? " heartfall--active" : ""}`}>
      {hearts.map(([side, offset, size, delay, duration], index) => (
        <span
          className={`heartfall__heart heartfall__heart--${side}`}
          key={index}
          style={{ "--offset": `${offset}vw`, "--size": `${size}px`, "--delay": `${delay}s`, "--duration": `${duration}s` } as CSSProperties}
        >
          <svg viewBox="0 0 24 22">
            <path d="M12 21C10 19.3 1 13.3 1 6.9 1 3.6 3.6 1 6.8 1c2.1 0 4 1.1 5.2 2.9C13.2 2.1 15.1 1 17.2 1 20.4 1 23 3.6 23 6.9 23 13.3 14 19.3 12 21Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
