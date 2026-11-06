"use client";

import { useRef, useState } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function InvitationCover() {
  const coverRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);

  function openInvitation() {
    if (opening) return;
    setOpening(true);
    coverRef.current?.closest(".wedding-site")?.classList.add("wedding-site--revealing");
    window.dispatchEvent(new Event("invitation:open"));

    if (prefersReducedMotion()) {
      setOpened(true);
      return;
    }
    // Fallback in case animationend never fires (e.g. a background tab).
    window.setTimeout(() => setOpened(true), 2600);
  }

  if (opened) return null;

  return (
    <div className={`invitation-cover${opening ? " invitation-cover--opening" : ""}`} ref={coverRef}>
      <div className="invitation-cover__artwork">
        <picture className="invitation-cover__artwork-picture">
          <source media="(min-width: 681px)" srcSet="/images/cover-desktop-1365.avif" type="image/avif" />
          <source media="(min-width: 681px)" srcSet="/images/cover-desktop-1365.webp" type="image/webp" />
          <source
            sizes="100vw"
            srcSet="/images/cover-mobile-540.avif 540w, /images/cover-mobile-768.avif 768w"
            type="image/avif"
          />
          <source
            sizes="100vw"
            srcSet="/images/cover-mobile-540.webp 540w, /images/cover-mobile-768.webp 768w"
            type="image/webp"
          />
          <img
            alt=""
            className="invitation-cover__artwork-image"
            decoding="async"
            fetchPriority="high"
            height={1365}
            src="/images/cover-mobile-768.webp"
            width={768}
          />
        </picture>
        <button
          aria-label={opening ? "Opening wedding invitation" : "Tap to open the wedding invitation"}
          className="invitation-cover__button"
          type="button"
          onClick={openInvitation}
          disabled={opening}
        >
          <span className="visually-hidden">Tap to open the wedding invitation</span>
        </button>
      </div>
      <div className="invitation-cover__curtain invitation-cover__curtain--left" aria-hidden="true" />
      <div
        className="invitation-cover__curtain invitation-cover__curtain--right"
        onAnimationEnd={(event) => {
          if (event.animationName === "wedding-curtain-right") {
            window.setTimeout(() => setOpened(true), 200);
          }
        }}
        aria-hidden="true"
      />
      <div className="invitation-cover__petals" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <svg aria-hidden="true" className="invitation-cover__rose" viewBox="0 0 80 96">
        <defs>
          <linearGradient id="rose-petal" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f4b39b" />
            <stop offset=".52" stopColor="#b82e36" />
            <stop offset="1" stopColor="#661a28" />
          </linearGradient>
        </defs>
        <path d="M40 51c-7 11-9 24-7 38h14c2-14 0-27-7-38Z" fill="#426044" />
        <path d="M34 72c-9-12-17-12-23-8 7 11 14 15 24 13M46 66c8-13 17-14 23-10-6 12-13 17-23 16" fill="#55734e" />
        <path d="M40 7c-5 8-18 10-19 23-1 13 9 23 19 24 11-1 20-11 19-24C58 17 45 15 40 7Z" fill="url(#rose-petal)" />
        <path d="M40 13c-8 6-12 13-9 20 2 6 7 10 9 11 3-3 8-7 10-13 2-7-2-13-10-18Z" fill="#d84b4c" />
        <path d="M40 19c-4 4-6 8-4 12 1 3 3 5 4 6 2-2 4-4 5-7 1-4-1-8-5-11Z" fill="#f3a286" />
        <path d="M24 25c-8 10-1 23 9 27M56 25c8 10 1 23-9 27" fill="none" stroke="#f4b39b" strokeWidth="2" />
      </svg>
    </div>
  );
}
