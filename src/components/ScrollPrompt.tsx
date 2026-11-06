"use client";

import { useEffect, useState } from "react";

/** Animated "Scroll down" cue for the front page. Hides for good once the guest starts scrolling. */
export default function ScrollPrompt() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 24) {
        setHidden(true);
        window.removeEventListener("scroll", handleScroll);
      }
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      aria-hidden={hidden || undefined}
      className={`scroll-prompt${hidden ? " scroll-prompt--hidden" : ""}`}
      href="#invitation"
      tabIndex={hidden ? -1 : undefined}
    >
      <span className="scroll-prompt__label">Scroll down</span>
      <span className="scroll-prompt__mouse" aria-hidden="true"><i /></span>
      <span className="scroll-prompt__chevrons" aria-hidden="true"><i /><i /></span>
    </a>
  );
}
