"use client";

import { weddingDetails } from "@/data/wedding";

export default function TraditionalInvitation() {
  return (
    <section
      className="traditional-invitation section-pad"
      id="traditional-invitation"
      aria-labelledby="traditional-invitation-title"
      data-scroll-reveal
    >
      <div className="traditional-invitation__intro">
        <p className="eyebrow">A TRADITIONAL INVITATION</p>
        <p className="traditional-invitation__ganesh" lang="ne">॥ श्री गणेशाय नमः ॥</p>
        <div className="traditional-invitation__verse" lang="ne">
          {weddingDetails.traditionalInvitation.verse.map((line) => <p key={line}>{line}</p>)}
        </div>
      </div>

      <article className="traditional-invitation__card" lang="ne">
        <div className="traditional-invitation__card-inner">
          <div className="traditional-invitation__edge-ornament traditional-invitation__edge-ornament--top" aria-hidden="true">❧　✦　❧</div>
          <div className="traditional-invitation__title">
            <span aria-hidden="true">❧</span>
            <h2 id="traditional-invitation-title">सादर निमन्त्रणा</h2>
            <span aria-hidden="true">❧</span>
          </div>

          <div className="traditional-invitation__families">
            <section className="traditional-invitation__family" aria-labelledby="bride-family-title">
              <p className="traditional-invitation__role" id="bride-family-title">वधू पक्ष</p>
              <span className="traditional-invitation__family-ornament" aria-hidden="true">✦</span>
              <p className="traditional-invitation__relation">{weddingDetails.traditionalInvitation.brideRole}</p>
              <h3>{weddingDetails.traditionalInvitation.brideNameNepali}</h3>
              <p>बुबा: {weddingDetails.bride.father}</p>
              <p>आमा: {weddingDetails.bride.mother}</p>
              <p className="traditional-invitation__address">निवास: {weddingDetails.bride.address}</p>
            </section>

            <div className="traditional-invitation__joining-mark" aria-hidden="true">
              <span>✥</span>
              <i />
              <span>&amp;</span>
              <i />
              <span>✥</span>
            </div>

            <section className="traditional-invitation__family" aria-labelledby="groom-family-title">
              <p className="traditional-invitation__role" id="groom-family-title">वर पक्ष</p>
              <span className="traditional-invitation__family-ornament" aria-hidden="true">✦</span>
              <p className="traditional-invitation__relation">{weddingDetails.traditionalInvitation.groomRole}</p>
              <h3>{weddingDetails.traditionalInvitation.groomNameNepali}</h3>
              <p>बुबा: {weddingDetails.groom.father}</p>
              <p>आमा: {weddingDetails.groom.mother}</p>
              <p className="traditional-invitation__address">निवास: {weddingDetails.groom.address}</p>
            </section>
          </div>

          <div className="traditional-invitation__event">
            <span className="traditional-invitation__divider" aria-hidden="true">❦　❧　❦</span>
            <h3>वैवाहिक कार्यक्रम</h3>
            <p className="traditional-invitation__detail-label">मिति</p>
            <p className="traditional-invitation__date">{weddingDetails.dateNepali}</p>
            <div className="traditional-invitation__schedule">
              <p>
                <span>समय</span>
                <strong>{weddingDetails.traditionalInvitation.weddingTime}</strong>
              </p>
              <p>
                <span>प्रितिभोज समय</span>
                <strong>{weddingDetails.traditionalInvitation.feastTime}</strong>
              </p>
            </div>
            <p className="traditional-invitation__detail-label">स्थान</p>
            <p className="traditional-invitation__venue">{weddingDetails.venue.name}</p>
            <p className="traditional-invitation__address">{weddingDetails.venue.location}</p>
          </div>

          <p className="traditional-invitation__closing">{weddingDetails.traditionalInvitation.message}</p>
          <div className="traditional-invitation__edge-ornament traditional-invitation__edge-ornament--bottom" aria-hidden="true">❧　✦　❧</div>
        </div>
      </article>
    </section>
  );
}
