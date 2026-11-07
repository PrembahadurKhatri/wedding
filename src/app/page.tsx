import HeroVideo from "@/components/HeroVideo";
import InvitationCover from "@/components/InvitationCover";
import ScratchDateCard from "@/components/ScratchDateCard";
import ScrollPrompt from "@/components/ScrollPrompt";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollHeartfall from "@/components/ScrollHeartfall";
import TraditionalInvitation from "@/components/TraditionalInvitation";
import WeddingCountdown from "@/components/WeddingCountdown";
import { weddingDetails } from "@/data/wedding";

// Simple line icons for the wedding-day timeline: oil lamp (feast), garland (procession), rings (ceremony).
const scheduleIcons = [
  <svg key="feast" viewBox="0 0 24 24"><path d="M12 3.5c1.6 2 2.2 3.4 1.6 4.7-.4.9-1.1 1.3-1.6 1.3s-1.2-.4-1.6-1.3c-.6-1.3 0-2.7 1.6-4.7Z" /><path d="M3.5 12.5h17c-.6 3.6-4 6-8.5 6s-7.9-2.4-8.5-6Z" /><path d="M9 21h6" /></svg>,
  <svg key="procession" viewBox="0 0 24 24"><path d="M4 5c0 7 3.6 12 8 12s8-5 8-12" /><circle cx="5" cy="9" r="1.2" /><circle cx="7.4" cy="13" r="1.2" /><circle cx="12" cy="17" r="1.6" /><circle cx="16.6" cy="13" r="1.2" /><circle cx="19" cy="9" r="1.2" /><path d="M12 18.6V21" /></svg>,
  <svg key="ceremony" viewBox="0 0 24 24"><circle cx="9" cy="14" r="5.5" /><circle cx="15" cy="14" r="5.5" /><path d="m13.2 5.6 1.8-2.3 1.8 2.3-1.8 1.6Z" /></svg>,
];

export default function WeddingInvitation() {
  return (
    <main className="wedding-site">
      <ScrollReveal />
      <ScrollHeartfall />
      <InvitationCover />

      <section className="hero" id="home" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">TOGETHER WITH OUR FAMILIES</p>
          <h1 id="hero-title" className="hero__names">
            <span className="hero__name">{weddingDetails.bride.nameEnglish}</span>
            <span className="hero__ampersand">&amp;</span>
            <span className="hero__name">{weddingDetails.groom.nameEnglish}</span>
          </h1>
          <span className="hero__sparkles" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></span>
        </div>
        <span className="hero__side-note" aria-hidden="true">A DAY TO REMEMBER · A LOVE TO CELEBRATE</span>
        <ScrollPrompt />
      </section>

      <section className="invitation-message section-pad" id="invitation" aria-labelledby="invitation-message-title" data-scroll-reveal>
        <p className="eyebrow">A JOY MADE GREATER WHEN SHARED</p>
        <span className="invitation-message__ornament" aria-hidden="true"><i />✦<i /></span>
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
              <span className="schedule__icon" aria-hidden="true">{scheduleIcons[index]}</span>
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
          <p className="venue__english-name">Kantipur Garden Batika</p>
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
            title="Map to Kantipur Garden Batika, Pokhara"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7032.8974290803535!2d84.00949668138799!3d28.193676676832272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39959500463d5c77%3A0x3dd158c5f5f6c10b!2sKantipur%20Garden%20Batika!5e0!3m2!1sen!2snp!4v1793615370003!5m2!1sen!2snp"
          />
        </div>
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
