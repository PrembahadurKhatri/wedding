"use client";

import { useEffect, useRef, useState } from "react";

// Portrait clip for phones / portrait tablets, landscape clip for laptops and desktops.
const PORTRAIT_QUERY = "(orientation: portrait)";
const clips = {
  portrait: { webm: "/wedding.webm", mp4: "/wedding.mp4" },
  landscape: { webm: "/weddinglaptop.webm", mp4: "/weddinglaptop.mp4" },
} as const;

/** Re-runs the CSS entrance + sparkle on the hero text (one run per video loop). */
function replayHeroText(hero: Element | null) {
  if (!hero) return;
  hero.classList.remove("hero--cycle");
  void (hero as HTMLElement).offsetWidth; // restart CSS animations
  hero.classList.add("hero--cycle");
}

/**
 * Muted, looping background video for the front page.
 * - Only the clip for the current orientation is downloaded, and only after the page has loaded
 *   (the cover artwork goes first). A poster frame shows until playback starts.
 * - Every time the clip loops, the names rise in and sparkle again above the swans.
 * - Guests who prefer reduced motion get the still poster.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const hero = video.closest(".hero");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const portrait = window.matchMedia(PORTRAIT_QUERY);
    let lastTime = 0;
    let currentKey: keyof typeof clips | null = null;

    const loadClip = () => {
      const key = portrait.matches ? "portrait" : "landscape";
      if (key === currentKey) return;
      currentKey = key;
      video.replaceChildren(
        Object.assign(document.createElement("source"), { src: clips[key].webm, type: "video/webm" }),
        Object.assign(document.createElement("source"), { src: clips[key].mp4, type: "video/mp4" }),
      );
      video.load();
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (video.currentTime + 0.5 < lastTime) replayHeroText(hero); // wrapped around → new loop
      lastTime = video.currentTime;
    };
    const onPlaying = () => video.classList.add("hero__video--playing");
    // When the guest opens the cover, start the clip from the beginning so the text and swans line up.
    // The curtains cover the page for ~1.1 s after the tap, so wait until it is visible.
    let openTimer: number | undefined;
    const onOpen = () => {
      openTimer = window.setTimeout(() => {
        replayHeroText(hero);
        if (reduceMotion || !currentKey) return;
        video.currentTime = 0;
        lastTime = 0;
        video.play().catch(() => {});
      }, reduceMotion ? 0 : 1100);
    };

    window.addEventListener("invitation:open", onOpen);
    if (reduceMotion) {
      setShowPoster(true);
      return () => {
        window.clearTimeout(openTimer);
        window.removeEventListener("invitation:open", onOpen);
      };
    }

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("playing", onPlaying);
    portrait.addEventListener("change", loadClip);
    const start = () => {
      setShowPoster(true);
      loadClip();
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.clearTimeout(openTimer);
      window.removeEventListener("invitation:open", onOpen);
      window.removeEventListener("load", start);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("playing", onPlaying);
      portrait.removeEventListener("change", loadClip);
    };
  }, []);

  return (
    <div className="hero__media" aria-hidden="true">
      {/* Requested after page load so it never competes with the cover artwork or the app code. */}
      {showPoster && (
        <picture>
          <source media={PORTRAIT_QUERY} srcSet="/images/hero-poster-mobile.webp" />
          <img alt="" className="hero__poster" decoding="async" src="/images/hero-poster-desktop.webp" />
        </picture>
      )}
      <video className="hero__video" disablePictureInPicture loop muted playsInline preload="none" ref={videoRef} />
      <div className="hero__veil" />
    </div>
  );
}
