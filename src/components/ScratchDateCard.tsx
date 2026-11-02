"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { weddingDetails } from "@/data/wedding";

function traceHeart(context: CanvasRenderingContext2D, width: number, height: number) {
  context.beginPath();
  context.moveTo(width * 0.5, height * 0.9);
  context.bezierCurveTo(width * 0.4, height * 0.78, width * 0.04, height * 0.5, width * 0.04, height * 0.3);
  context.bezierCurveTo(width * 0.04, height * 0.08, width * 0.32, height * 0.03, width * 0.5, height * 0.23);
  context.bezierCurveTo(width * 0.68, height * 0.03, width * 0.96, height * 0.08, width * 0.96, height * 0.3);
  context.bezierCurveTo(width * 0.96, height * 0.5, width * 0.6, height * 0.78, width * 0.5, height * 0.9);
  context.closePath();
}

export default function ScratchDateCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const totalScratchablePixels = useRef(0);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !card || !context) return;

    contextRef.current = context;
    const drawSurface = () => {
      const bounds = card.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      traceHeart(context, bounds.width, bounds.height);
      context.save();
      context.clip();

      const foil = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      foil.addColorStop(0, "#e9dbc0");
      foil.addColorStop(0.35, "#b89560");
      foil.addColorStop(0.55, "#f1e4c9");
      foil.addColorStop(0.8, "#a98450");
      foil.addColorStop(1, "#e4d1aa");
      context.fillStyle = foil;
      context.fillRect(0, 0, bounds.width, bounds.height);

      context.globalAlpha = 0.26;
      context.strokeStyle = "#fff8e8";
      context.lineWidth = 1;
      for (let x = -bounds.height; x < bounds.width + bounds.height; x += 16) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x - bounds.height, bounds.height);
        context.stroke();
      }
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
        <svg className="scratch-card__heart" viewBox="0 0 320 290" aria-hidden="true">
          <path d="M160 264C130 235 12 156 12 85 12 22 91 5 160 71 229 5 308 22 308 85c0 71-118 150-148 179Z" />
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
        {isRevealed && (
          <svg
            aria-hidden="true"
            className="scratch-card__falling-rose"
            viewBox="0 0 80 96"
          >
            <path d="M40 51c-7 11-9 24-7 38h14c2-14 0-27-7-38Z" fill="#426044" />
            <path d="M34 72c-9-12-17-12-23-8 7 11 14 15 24 13M46 66c8-13 17-14 23-10-6 12-13 17-23 16" fill="#55734e" />
            <path d="M40 7c-5 8-18 10-19 23-1 13 9 23 19 24 11-1 20-11 19-24C58 17 45 15 40 7Z" fill="#a71f36" />
            <path d="M40 13c-8 6-12 13-9 20 2 6 7 10 9 11 3-3 8-7 10-13 2-7-2-13-10-18Z" fill="#d84b4c" />
            <path d="M40 19c-4 4-6 8-4 12 1 3 3 5 4 6 2-2 4-4 5-7 1-4-1-8-5-11Z" fill="#f3a286" />
          </svg>
        )}
      </div>
      {!isRevealed && (
        <button className="scratch-section__reveal-button" onClick={revealDate} type="button">
          Reveal the date
        </button>
      )}
      {isRevealed && (
        <p className="scratch-section__save-label" role="status">SAVE THE DATE</p>
      )}
    </section>
  );
}
