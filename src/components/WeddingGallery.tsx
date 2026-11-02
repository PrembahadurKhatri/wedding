"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { weddingGallery, weddingPhotoUrl } from "@/data/gallery";
import { weddingDetails } from "@/data/wedding";

export default function WeddingGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const activePhoto = activeIndex === null ? null : weddingGallery[activeIndex];
  const isLightboxOpen = activeIndex !== null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + weddingGallery.length) % weddingGallery.length,
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : (index + 1) % weddingGallery.length,
    );
  }, []);

  useEffect(() => {
    const galleryItems = document.querySelectorAll<HTMLElement>("[data-gallery-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      galleryItems.forEach((item) => item.classList.add("is-visible"));
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    galleryItems.forEach((item) => observer.observe(item));
    setIsRevealed(true);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      } else if (event.key === "Tab") {
        const controls = Array.from(
          document.querySelectorAll<HTMLElement>(".gallery-lightbox__dialog button"),
        );
        if (controls.length === 0) return;

        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, closeLightbox, showNext, showPrevious]);

  function openLightbox(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }

  return (
    <section
      className="gallery section-pad"
      id="gallery"
      aria-labelledby="gallery-title"
    >
      <div className="gallery__heading">
        <div>
          <p className="eyebrow">
            {weddingDetails.bride.nameEnglish} &amp; {weddingDetails.groom.nameEnglish}
          </p>
          <h2 id="gallery-title">OUR BEAUTIFUL<br /><em>BEGINNING</em></h2>
          <p className="gallery__nepali-title" lang="ne">हाम्रो सुन्दर सुरुवात</p>
        </div>
        <p>
          A wedding portrait of Aashma and Diwas, alongside sample photographs
          for inspiration.
        </p>
      </div>

      <div className={`gallery__grid${isRevealed ? " gallery__grid--ready" : ""}`}>
        {weddingGallery.map((photo, index) => (
          <figure
            className={`gallery__item gallery__item--${index + 1} gallery__item--${photo.orientation}`}
            data-gallery-reveal
            key={photo.id}
          >
            <button
              aria-label={`Open photograph ${index + 1} of ${weddingGallery.length}: ${photo.alt}`}
              className="gallery__trigger"
              onClick={(event) => openLightbox(index, event.currentTarget)}
              type="button"
            >
              <img
                alt={photo.alt}
                className="gallery__image"
                decoding="async"
                height={photo.imageId.startsWith("/") ? 832 : photo.orientation === "portrait" ? 1500 : 1000}
                loading="lazy"
                sizes="(max-width: 680px) 94vw, (max-width: 1000px) 48vw, 42vw"
                src={weddingPhotoUrl(photo.imageId, 1200)}
                srcSet={photo.imageId.startsWith("/") ? undefined : `${weddingPhotoUrl(photo.imageId, 640)} 640w, ${weddingPhotoUrl(photo.imageId, 960)} 960w, ${weddingPhotoUrl(photo.imageId, 1440)} 1440w`}
                width={photo.imageId.startsWith("/") ? 768 : photo.orientation === "portrait" ? 1000 : 1500}
              />
              <span className="gallery__open-hint" aria-hidden="true">VIEW PHOTOGRAPH ↗</span>
            </button>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className="gallery__caption">THE COUPLE’S PORTRAIT · WEDDING INSPIRATION</p>

      {activePhoto && activeIndex !== null && (
        <div
          className="gallery-lightbox"
          onClick={closeLightbox}
          role="presentation"
        >
          <div
            aria-label={`Wedding photograph ${activeIndex + 1} of ${weddingGallery.length}`}
            aria-modal="true"
            className="gallery-lightbox__dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="gallery-lightbox__controls">
              <span className="gallery-lightbox__count">
                {String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(weddingGallery.length).padStart(2, "0")}
              </span>
              <button
                aria-label="Close photo viewer"
                className="gallery-lightbox__control gallery-lightbox__close"
                onClick={closeLightbox}
                ref={closeButtonRef}
                type="button"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <button
              aria-label="Previous photograph"
              className="gallery-lightbox__control gallery-lightbox__arrow gallery-lightbox__arrow--previous"
              onClick={showPrevious}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <figure
              className={`gallery-lightbox__figure gallery-lightbox__figure--${activePhoto.orientation}`}
              onTouchStart={(event) => {
                const touch = event.changedTouches[0];
                touchStartRef.current = touch
                  ? { x: touch.clientX, y: touch.clientY }
                  : null;
              }}
              onTouchEnd={(event) => {
                const start = touchStartRef.current;
                const touch = event.changedTouches[0];
                touchStartRef.current = null;
                if (!start || !touch) return;

                const deltaX = start.x - touch.clientX;
                const deltaY = start.y - touch.clientY;
                if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
                if (deltaX > 0) showNext();
                else showPrevious();
              }}
            >
              <img
                alt={activePhoto.alt}
                className="gallery-lightbox__image"
                decoding="async"
                height={activePhoto.imageId.startsWith("/") ? 832 : activePhoto.orientation === "portrait" ? 1800 : 1200}
                sizes="(max-width: 800px) 96vw, 88vw"
                src={weddingPhotoUrl(activePhoto.imageId, 2000)}
                srcSet={activePhoto.imageId.startsWith("/") ? undefined : `${weddingPhotoUrl(activePhoto.imageId, 960)} 960w, ${weddingPhotoUrl(activePhoto.imageId, 1440)} 1440w, ${weddingPhotoUrl(activePhoto.imageId, 2000)} 2000w`}
                width={activePhoto.imageId.startsWith("/") ? 768 : activePhoto.orientation === "portrait" ? 1200 : 1800}
              />
              <figcaption>{activePhoto.caption}</figcaption>
            </figure>
            <button
              aria-label="Next photograph"
              className="gallery-lightbox__control gallery-lightbox__arrow gallery-lightbox__arrow--next"
              onClick={showNext}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
            <p className="gallery-lightbox__notice" role="status">
              {activePhoto.imageId.startsWith("/")
                ? "Aashma Timilsina and Diwas Sapkota, the bride and groom."
                : `Wedding inspiration photograph ${activeIndex + 1} of ${weddingGallery.length}.`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
