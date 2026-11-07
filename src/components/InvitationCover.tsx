"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

// Opening envelope video. Portrait clip on phones / portrait tablets, landscape (cropped) clip on laptops.
// Both clips end on a white flash, so each reveals at `revealAt` (the moment the flash fills the frame).
// Mobile uses the 16:9 envelope clip (from dd.mp4, black bars cropped off) centred on a dark backdrop.
const PORTRAIT_QUERY = "(orientation: portrait)";
// `rate` > 1 plays the clip a little faster than recorded.
type Clip = { src: string; revealAt: number | null; rate: number };
const clips: Record<"portrait" | "landscape", Clip> = {
  portrait: { src: "/open-mobile.mp4", revealAt: 3.2, rate: 1.1 },
  landscape: { src: "/open-desktop.mp4", revealAt: 2.35, rate: 1.3 },
};
const FADE_MS = 450;
// If the clip is still downloading when the guest taps, wait this long for it before opening without it.
const START_TIMEOUT_MS = 3000;

export default function InvitationCover() {
  const coverRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clipRef = useRef<Clip>(clips.portrait);
  const revealedRef = useRef(false);
  const [phase, setPhase] = useState<"closed" | "playing" | "revealing" | "open">("closed");

  // Pick the clip for this screen and start buffering it straight away, so the tap plays instantly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const clip = window.matchMedia(PORTRAIT_QUERY).matches ? clips.portrait : clips.landscape;
    clipRef.current = clip;
    video.src = clip.src;
    video.load();
  }, []);

  function reveal() {
    if (revealedRef.current) return;
    revealedRef.current = true;
    coverRef.current?.closest(".wedding-site")?.classList.add("wedding-site--revealing");
    window.dispatchEvent(new Event("invitation:open"));
    setPhase("revealing");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setPhase("open"), reduceMotion ? 0 : FADE_MS);
  }

  function openInvitation() {
    if (phase !== "closed") return;
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }
    setPhase("playing");
    const { revealAt, rate } = clipRef.current;
    video.playbackRate = rate;
    const fallback = window.setTimeout(() => {
      if (video.currentTime < 0.05) reveal();
    }, START_TIMEOUT_MS);
    video.addEventListener(
      "playing",
      () => {
        window.clearTimeout(fallback);
        // Precise timer for the hand-off (timeupdate only fires every ~250 ms). No revealAt → wait for "ended".
        if (revealAt !== null) window.setTimeout(reveal, Math.max(0, ((revealAt - video.currentTime) / rate) * 1000));
      },
      { once: true },
    );
    video.play().catch(() => {
      window.clearTimeout(fallback);
      reveal();
    });
  }

  if (phase === "open") return null;

  return (
    <div
      className={`invitation-cover invitation-cover--${phase}`}
      ref={coverRef}
      style={{ "--cover-fade": `${FADE_MS}ms` } as CSSProperties}
    >
      <div className="invitation-cover__frame">
        <picture>
          <source media={PORTRAIT_QUERY} srcSet="/images/open-mobile-poster.webp" />
          <img
            alt=""
            className="invitation-cover__poster"
            decoding="async"
            fetchPriority="high"
            src="/images/open-desktop-poster.webp"
          />
        </picture>
        <video
          className="invitation-cover__video"
          disablePictureInPicture
          muted
          onEnded={reveal}
          onError={() => {
            if (phase === "playing") reveal();
          }}
          onTimeUpdate={(event) => {
            const { revealAt } = clipRef.current;
            if (revealAt !== null && event.currentTarget.currentTime >= revealAt) reveal();
          }}
          playsInline
          preload="auto"
          ref={videoRef}
        />
        {/* The clip's own "TAP TO OPEN" is only a few pixels tall at source and looks blurry, so a crisp
            label is drawn over it (on a paper-coloured patch) and fades out as the sparks begin. */}
        <span className="invitation-cover__label" aria-hidden="true">
          <span>Tap to Open</span>
        </span>
        <button
          aria-label={phase === "closed" ? "Open the wedding invitation" : "Opening the wedding invitation"}
          className="invitation-cover__button"
          disabled={phase !== "closed"}
          onClick={openInvitation}
          type="button"
        >
          <span className="invitation-cover__pulse" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
