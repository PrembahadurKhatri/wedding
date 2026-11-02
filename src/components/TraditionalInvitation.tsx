"use client";

import { useEffect, useState } from "react";
import { weddingDetails } from "@/data/wedding";

export default function TraditionalInvitation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const revealForPrint = () => setIsOpen(true);
    window.addEventListener("beforeprint", revealForPrint);
    return () => window.removeEventListener("beforeprint", revealForPrint);
  }, []);

  return (
    <section
      className="traditional-invitation section-pad"
      id="traditional-invitation"
      aria-labelledby="traditional-invitation-title"
    >
      <div className="traditional-invitation__intro">
        <p className="eyebrow">A TRADITIONAL INVITATION</p>
        <h2 id="traditional-invitation-title">
          A heartfelt welcome,<br /><em>from our families.</em>
        </h2>
        <p>
          Read the wedding invitation in the words and spirit of a traditional
          Nepali निमन्त्रणा.
        </p>
      </div>

      <div className="traditional-invitation__actions">
        <button
          aria-controls="nepali-invitation-card"
          aria-expanded={isOpen}
          className="traditional-invitation__button traditional-invitation__button--primary"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span lang="ne">{isOpen ? "निमन्त्रणा बन्द गर्नुहोस्" : "निमन्त्रणा पढ्नुहोस्"}</span>
          <span aria-hidden="true">{isOpen ? "−" : "＋"}</span>
        </button>
        <button
          className="traditional-invitation__button traditional-invitation__button--print"
          onClick={() => {
            setIsOpen(true);
            window.requestAnimationFrame(() => window.print());
          }}
          type="button"
        >
          <span lang="ne">प्रिन्ट गर्नुहोस्</span>
          <span aria-hidden="true">⌑</span>
        </button>
      </div>

      <article
        aria-hidden={!isOpen}
        className="traditional-invitation__card"
        hidden={!isOpen}
        id="nepali-invitation-card"
        lang="ne"
      >
          <div className="traditional-invitation__card-inner">
            <p className="traditional-invitation__ganesh">॥ श्री गणेशाय नमः ॥</p>

            <div className="traditional-invitation__verse">
              <p>मंगलम भगवान विष्णुः</p>
              <p>मंगलम गरुडध्वजः ।</p>
              <p>मंगलम पुण्डरीकाक्षः</p>
              <p>मंगलाय तनो हरिः ॥</p>
            </div>

            <div className="traditional-invitation__title">
              <span aria-hidden="true">✥</span>
              <h3>सादर निमन्त्रणा</h3>
              <span aria-hidden="true">✥</span>
            </div>

            <div className="traditional-invitation__families">
              <section className="traditional-invitation__family">
                <p className="traditional-invitation__role">कन्या</p>
                <h4>{weddingDetails.bride.nameNepali}</h4>
                <p>बुबा: {weddingDetails.bride.father}</p>
                <p>आमा: {weddingDetails.bride.mother}</p>
                <p>निवास: {weddingDetails.bride.address}</p>
              </section>

              <span className="traditional-invitation__joining-mark" aria-hidden="true">&amp;</span>

              <section className="traditional-invitation__family">
                <p className="traditional-invitation__role">वर</p>
                <h4>{weddingDetails.groom.nameNepali}</h4>
                <p>बुबा: {weddingDetails.groom.father}</p>
                <p>आमा: {weddingDetails.groom.mother}</p>
                <p>निवास: {weddingDetails.groom.address}</p>
              </section>
            </div>

            <div className="traditional-invitation__event">
              <p className="traditional-invitation__label">विवाह मिति</p>
              <p className="traditional-invitation__date">{weddingDetails.dateNepali}</p>
              <span className="traditional-invitation__divider" aria-hidden="true">❦</span>
              <p className="traditional-invitation__label">स्थान</p>
              <p className="traditional-invitation__venue">{weddingDetails.venue.name}</p>
              <p className="traditional-invitation__address">{weddingDetails.venue.location}</p>

              <div className="traditional-invitation__schedule">
                {weddingDetails.schedule.map((event) => (
                  <p key={event.title}>
                    <span>{event.title}</span>
                    <strong>{event.time}</strong>
                  </p>
                ))}
              </div>
            </div>

            <p className="traditional-invitation__closing">
              विवाह कार्यक्रममा उपस्थित भई वर–वधूलाई आशीर्वाद तथा शुभकामना प्रदान
              गरिदिनुहुन यहाँको गरिमामय उपस्थितिका लागि हार्दिक निमन्त्रणा गर्दछौँ।
            </p>
          </div>
      </article>
    </section>
  );
}
