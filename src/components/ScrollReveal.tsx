"use client";

import { useEffect } from "react";

/** Adds `is-visible` to every [data-scroll-reveal] element as it enters the viewport. Renders nothing. */
export default function ScrollReveal() {
  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>("[data-scroll-reveal]");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("has-scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    revealTargets.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-scroll-reveal");
    };
  }, []);

  return null;
}
