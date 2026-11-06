"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { weddingDetails } from "@/data/wedding";
import { googleCalendarUrl } from "@/lib/calendar";

// Shower of small hearts that falls when the date is revealed.
// left %, sideways drift px, size px, delay s, duration s, spin deg, colour tone
const showerHearts = [
  [8, 18, 12, 0, 1.9, 40, "ruby"], [18, -14, 9, 0.12, 2.1, -30, "rose"], [27, 22, 15, 0.05, 1.8, 25, "blush"],
  [36, -20, 10, 0.3, 2.2, -45, "ruby"], [45, 12, 13, 0.18, 1.9, 35, "rose"], [52, -10, 8, 0.42, 2.3, -20, "blush"],
  [60, 24, 14, 0.08, 2, 50, "ruby"], [68, -18, 11, 0.26, 1.85, -35, "rose"], [76, 16, 9, 0.5, 2.2, 30, "blush"],
  [84, -22, 13, 0.14, 2, -40, "ruby"], [92, 12, 10, 0.36, 2.1, 20, "rose"], [14, 8, 8, 0.6, 2.4, -25, "blush"],
  [40, 26, 11, 0.7, 2.2, 45, "rose"], [56, -24, 12, 0.62, 2, -30, "ruby"], [72, 10, 8, 0.78, 2.3, 25, "blush"],
  [30, -12, 9, 0.9, 2.1, -20, "ruby"], [64, 20, 10, 0.95, 2.2, 35, "rose"], [88, -8, 8, 1, 2.3, -45, "blush"],
] as const;

// Same outline as the SVG heart (viewBox 320×290) so the foil covers it exactly.
const HEART_PATH = "M160 264C130 235 12 156 12 85 12 22 91 5 160 71 229 5 308 22 308 85c0 71-118 150-148 179Z";

function heartPath(width: number, height: number) {
  const path = new Path2D();
  path.addPath(new Path2D(HEART_PATH), new DOMMatrix().scale(width / 320, height / 290));
  return path;
}

export default function ScratchDateCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const totalScratchablePixels = useRef(0);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStartedScratching, setHasStartedScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !card || !context) return;

    contextRef.current = context;
    const drawSurface = () => {
      const bounds = card.getBoundingClientRect();
      // Skip while hidden/collapsed (0x0 would make getImageData throw).
      if (bounds.width < 1 || bounds.height < 1) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      const heart = heartPath(bounds.width, bounds.height);
      context.save();
      context.clip(heart);

      const { width, height } = bounds;
      // Rose-gold pearl foil: base gradient, soft sheen, faint glints and fixed-seed glitter.
      const foil = context.createLinearGradient(0, 0, width, height);
      foil.addColorStop(0, "#f7dcd3");
      foil.addColorStop(0.28, "#d9a092");
      foil.addColorStop(0.5, "#fbe9e2");
      foil.addColorStop(0.72, "#c8836f");
      foil.addColorStop(1, "#f0cbbf");
      context.fillStyle = foil;
      context.fillRect(0, 0, width, height);

      const sheen = context.createRadialGradient(width * 0.32, height * 0.28, 0, width * 0.32, height * 0.28, width * 0.62);
      sheen.addColorStop(0, "rgba(255, 255, 255, 0.6)");
      sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = sheen;
      context.fillRect(0, 0, width, height);

      context.globalAlpha = 0.14;
      context.strokeStyle = "#ffffff";
      context.lineWidth = 1;
      for (let x = -height; x < width + height; x += 14) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x - height, height);
        context.stroke();
      }
      context.globalAlpha = 1;

      let seed = 11;
      const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let index = 0; index < 260; index += 1) {
        const radius = 0.4 + random() * 1.3;
        context.fillStyle = random() > 0.3 ? `rgba(255, 255, 255, ${0.45 + random() * 0.5})` : `rgba(160, 84, 70, ${0.25 + random() * 0.25})`;
        context.beginPath();
        context.arc(random() * width, random() * height, radius, 0, Math.PI * 2);
        context.fill();
      }

      // Soft inner edge so the foil reads as embossed.
      context.strokeStyle = "rgba(122, 52, 44, 0.32)";
      context.lineWidth = 7;
      context.stroke(heart);
      context.restore();

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let opaqueCount = 0;
      for (let index = 3; index < pixels.length; index += 32 * 4) {
        if (pixels[index] > 128) opaqueCount += 1;
      }
      totalScratchablePixels.current = opaqueCount;
    };

    drawSurface();
    const observer = new ResizeObserver(drawSurface);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  function revealDate() {
    setIsRevealed(true);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function scratch(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || isRevealed) return;
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    const bounds = canvas.getBoundingClientRect();
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 38;
    context.beginPath();
    if (lastPoint.current) {
      context.moveTo(lastPoint.current.x, lastPoint.current.y);
    } else {
      context.moveTo(point.x, point.y);
    }
    context.lineTo(point.x, point.y);
    context.stroke();
    context.restore();
    lastPoint.current = point;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let remainingPixels = 0;
    let scratchedPixels = 0;
    for (let index = 3; index < pixels.length; index += 32 * 4) {
      if (pixels[index] > 128) remainingPixels += 1;
    }
    scratchedPixels = totalScratchablePixels.current - remainingPixels;
    if (totalScratchablePixels.current > 0 && scratchedPixels / totalScratchablePixels.current >= 0.42) {
      revealDate();
    }
  }

  return (
    <section className="scratch-section section-pad" id="save-the-date" aria-labelledby="scratch-title" data-scroll-reveal>
      <div className="scratch-section__intro">
        <p className="eyebrow">A LITTLE SURPRISE</p>
        <h2 id="scratch-title">Scratch to <em>reveal.</em></h2>
        <p>Reveal the date we can’t wait to celebrate with you.</p>
      </div>

      <div className={`scratch-card${isRevealed ? " scratch-card--revealed" : ""}`} ref={cardRef}>
        <span className="scratch-card__sparkles" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <svg className="scratch-card__heart" viewBox="0 0 320 290" aria-hidden="true">
          <defs>
            <radialGradient id="heart-ruby" cx="34%" cy="28%" r="82%">
              <stop offset="0" stopColor="#e8566b" />
              <stop offset=".32" stopColor="#b8223f" />
              <stop offset=".68" stopColor="#7e1029" />
              <stop offset="1" stopColor="#470514" />
            </radialGradient>
            <linearGradient id="heart-rim" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f7e3b4" />
              <stop offset=".4" stopColor="#c69a4e" />
              <stop offset=".56" stopColor="#fff1cc" />
              <stop offset="1" stopColor="#a47634" />
            </linearGradient>
            <radialGradient id="heart-gloss">
              <stop offset="0" stopColor="#fff" stopOpacity=".75" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path className="scratch-card__heart-body" d={HEART_PATH} />
          <path className="scratch-card__heart-bevel" d={HEART_PATH} transform="translate(11.2 10.2) scale(.93)" />
          <ellipse className="scratch-card__heart-gloss" cx="92" cy="72" rx="50" ry="25" transform="rotate(-32 92 72)" />
          <ellipse className="scratch-card__heart-gloss scratch-card__heart-gloss--small" cx="236" cy="60" rx="20" ry="10" transform="rotate(28 236 60)" />
        </svg>
        <div className="scratch-card__message" aria-live="polite">
          <span className="scratch-card__label">SAVE THE DATE</span>
          <strong lang="ne">{weddingDetails.dateNepali}</strong>
          <span>{weddingDetails.countdown.gregorianDateLabel}</span>
          <span lang="ne">{weddingDetails.venue.name}</span>
          <span lang="ne">{weddingDetails.venue.location}</span>
        </div>
        {!isRevealed && (
          <canvas
            aria-label="Scratch the heart to reveal the wedding date"
            className="scratch-card__foil"
            onPointerDown={(event) => {
              isDrawing.current = true;
              lastPoint.current = null;
              setHasStartedScratching(true);
              event.currentTarget.setPointerCapture(event.pointerId);
              scratch(event);
            }}
            onPointerMove={scratch}
            onPointerUp={() => {
              isDrawing.current = false;
              lastPoint.current = null;
            }}
            onPointerCancel={() => {
              isDrawing.current = false;
              lastPoint.current = null;
            }}
            ref={canvasRef}
          />
        )}
        {!isRevealed && (
          <span
            aria-hidden="true"
            className={`scratch-card__hint${hasStartedScratching ? " scratch-card__hint--hidden" : ""}`}
          >
            Scratch here
          </span>
        )}
        {isRevealed && (
          <span aria-hidden="true" className="scratch-card__heart-shower">
            {showerHearts.map(([x, drift, size, delay, duration, spin, tone], index) => (
              <svg
                className={`scratch-card__shower-heart scratch-card__shower-heart--${tone}`}
                key={index}
                style={{ "--x": `${x}%`, "--drift": `${drift}px`, "--size": `${size}px`, "--delay": `${delay}s`, "--duration": `${duration}s`, "--spin": `${spin}deg` } as CSSProperties}
                viewBox="0 0 24 22"
              >
                <path d="M12 21C10 19.3 1 13.3 1 6.9 1 3.6 3.6 1 6.8 1c2.1 0 4 1.1 5.2 2.9C13.2 2.1 15.1 1 17.2 1 20.4 1 23 3.6 23 6.9 23 13.3 14 19.3 12 21Z" />
              </svg>
            ))}
          </span>
        )}
      </div>
      {!isRevealed && (
        <button className="scratch-section__reveal-button" onClick={revealDate} type="button">
          Reveal the date
        </button>
      )}
      {isRevealed && (
        <a
          aria-label="Save the date: add the wedding to Google Calendar (opens in a new tab)"
          className="scratch-section__save-link"
          href={googleCalendarUrl()}
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg aria-hidden="true" className="scratch-section__save-icon" viewBox="0 0 24 24">
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
            <path className="scratch-section__save-icon-heart" d="M12 18c-1.6-1.3-3.6-2.7-3.6-4.4 0-1 .8-1.8 1.8-1.8.8 0 1.4.4 1.8 1 .4-.6 1-1 1.8-1 1 0 1.8.8 1.8 1.8 0 1.7-2 3.1-3.6 4.4Z" />
          </svg>
          <span className="scratch-section__save-label">Save the Date</span>
        </a>
      )}
    </section>
  );
}
