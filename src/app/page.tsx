"use client";

import { useEffect, useState } from "react";
import WeddingCountdown from "@/components/WeddingCountdown";
import ScratchDateCard from "@/components/ScratchDateCard";
import TraditionalInvitation from "@/components/TraditionalInvitation";
import ScrollRosefall from "@/components/ScrollRosefall";
import { weddingDetails } from "@/data/wedding";

export default function WeddingInvitation() {
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [invitationOpening, setInvitationOpening] = useState(false);

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

  function openInvitation() {
    if (invitationOpening) return;
    setInvitationOpening(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInvitationOpened(true);
      return;
    }

    window.setTimeout(() => setInvitationOpened(true), 3900);
  }

  return (
    <main className={`wedding-site${invitationOpening ? " wedding-site--revealing" : ""}`}>
      <ScrollRosefall />
      {!invitationOpened && (
        <div className={`invitation-cover${invitationOpening ? " invitation-cover--opening" : ""}`}>
          <div className="invitation-cover__artwork">
            <picture className="invitation-cover__artwork-picture">
              <source media="(min-width: 681px)" srcSet="/images/invite-desktop.png" />
              <img
                alt=""
                className="invitation-cover__artwork-image"
                decoding="async"
                fetchPriority="high"
                src="/images/invite-cover.png"
              />
            </picture>
            <button
              aria-label={invitationOpening ? "Opening wedding invitation" : "Tap to open the wedding invitation"}
              className="invitation-cover__button"
              type="button"
              onClick={openInvitation}
              disabled={invitationOpening}
            >
              <span className="visually-hidden">Tap to open the wedding invitation</span>
            </button>
          </div>
          <div className="invitation-cover__curtain invitation-cover__curtain--left" aria-hidden="true" />
          <div
            className="invitation-cover__curtain invitation-cover__curtain--right"
            onAnimationEnd={(event) => {
              if (event.animationName === "wedding-curtain-right") {
                window.setTimeout(() => setInvitationOpened(true), 450);
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
      )}

      <section className="hero" id="home" aria-labelledby="hero-title">
        <picture className="hero__image">
          <source media="(max-width: 680px)" srcSet="/images/mobilesize.png" />
          <img
            alt="Aashma Timilsina and Diwas Sapkota in their wedding attire"
            decoding="async"
            fetchPriority="high"
            src="/images/desktop.png"
          />
        </picture>
        <div className="hero__shade" />
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">TOGETHER WITH OUR FAMILIES</p>
          <h1 id="hero-title" className="hero__names">
            {weddingDetails.bride.nameEnglish}
            <span className="hero__ampersand">&amp;</span>
            {weddingDetails.groom.nameEnglish}
          </h1>
          <span className="hero__divider" />
          <a className="hero__discover" href="#invitation">CELEBRATE WITH US <span aria-hidden="true">↓</span></a>
        </div>
        <span className="hero__side-note">A DAY TO REMEMBER · A LOVE TO CELEBRATE</span>
      </section>

      <section className="invitation-message section-pad" id="invitation" aria-labelledby="invitation-message-title" data-scroll-reveal>
        <p className="eyebrow">A JOY MADE GREATER WHEN SHARED</p>
        <span className="invitation-message__ornament" aria-hidden="true">✦</span>
        <h2 id="invitation-message-title">
          With grateful hearts,<br />
          <em>we invite you.</em>
        </h2>
        <p>
          We are honoured to welcome you to celebrate the beginning of our life
          together. Your presence, blessings, and warm wishes will make our
          special day even more meaningful.
        </p>
        <span className="invitation-message__signature">
          {weddingDetails.bride.nameEnglish} &amp; {weddingDetails.groom.nameEnglish}
        </span>
      </section>

      <ScratchDateCard />

      <div data-scroll-reveal><WeddingCountdown /></div>

      <TraditionalInvitation />

      <section className="schedule section-pad" id="schedule" aria-labelledby="schedule-title" data-scroll-reveal>
        <div className="schedule__intro">
          <p className="eyebrow">CELEBRATE WITH US</p>
          <h2 id="schedule-title">The wedding<br /><em>day.</em></h2>
          <p>We look forward to sharing these joyful moments with you.</p>
          <p className="schedule__date" lang="ne">{weddingDetails.dateNepali}</p>
        </div>
        <div className="schedule__list">
          {weddingDetails.schedule.map((item, index) => (
            <article className="schedule__item" key={item.title}>
              <span className="schedule__index" aria-hidden="true">0{index + 1}</span>
              <div className="schedule__event">
                <span className="schedule__time" lang={item.time === weddingDetails.dateNepali ? "ne" : undefined}>{item.time}</span>
                <h3>{item.title}</h3>
                <p lang="ne">{item.titleNepali}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="venue section-pad" id="venue" aria-labelledby="venue-title" data-scroll-reveal>
        <svg className="venue__heart" viewBox="0 0 300 270" aria-hidden="true">
          <path d="M150 255C124 230 13 154 13 86 13 24 83 7 150 69 217 7 287 24 287 86c0 68-111 144-137 169Z" />
        </svg>
        <div className="venue__content">
          <p className="eyebrow">JOIN US IN POKHARA</p>
          <h2 id="venue-title">A place to<br /><em>gather.</em></h2>
          <span className="venue__ornament" aria-hidden="true">✦</span>
          <p className="venue__english-name">Kantipur Garden Party Palace</p>
          <p className="venue__name" lang="ne">{weddingDetails.venue.name}</p>
          <p className="venue__address" lang="ne">{weddingDetails.venue.location}</p>
          <a
            className="directions-link"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weddingDetails.venue.directionsQuery)}`}
            rel="noreferrer"
            target="_blank"
          >
            OPEN IN GOOGLE MAPS <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="venue__map">
          <iframe
            title={`Map to ${weddingDetails.venue.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent("Kantipur Garden Party Palace, Pokhara, Nepal")}&output=embed`}
          />
        </div>
        <div className="dress-code">
          <div className="dress-code__heading">
            <p className="eyebrow">A NOTE ON ATTIRE</p>
            <h3>Dress for the <em>celebration.</em></h3>
            <p>Traditional or formal attire is welcome. Choose what feels comfortable for a joyful day together.</p>
          </div>
          <article className="dress-code__option">
            <span className="dress-code__icon" aria-hidden="true">✦</span>
            <div>
              <p className="dress-code__label">FOR MEN</p>
              <h4>Classic &amp; graceful</h4>
              <p>Daura suruwal, kurta, or a formal suit.</p>
            </div>
          </article>
          <article className="dress-code__option">
            <span className="dress-code__icon" aria-hidden="true">✦</span>
            <div>
              <p className="dress-code__label">FOR WOMEN</p>
              <h4>Elegant &amp; festive</h4>
              <p>Sari, lehenga, or elegant formal attire.</p>
            </div>
          </article>
        </div>
        <p className="venue__footer">
          {weddingDetails.bride.nameEnglish} <i>&amp;</i> {weddingDetails.groom.nameEnglish}
          <span lang="ne">{weddingDetails.dateNepali}</span>
        </p>
      </section>

      <footer className="footer">
        <p className="eyebrow">UNTIL THEN, WITH LOVE</p>
        <p className="footer__names">
          {weddingDetails.bride.nameEnglish} <i>&amp;</i> {weddingDetails.groom.nameEnglish}
        </p>
        <p className="footer__date" lang="ne">
          {weddingDetails.dateNepali} · {weddingDetails.venue.location}
        </p>
        <a className="footer__top" href="#home">BACK TO THE BEGINNING ↑</a>
      </footer>
    </main>
  );
}
