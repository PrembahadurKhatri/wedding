# Wedding Invitation

A standalone, responsive Next.js wedding invitation for Aashma Timilsina and Diwash Sapkota. Names, family details, Nepali date, venue, schedule, traditional invitation copy and the Google Calendar event are centralized in `src/data/wedding.ts`. The page flows from the opening cover to a swan video front page, a welcome message, a scratch-to-reveal heart with a "Save the Date" Google Calendar button, a live countdown, the Nepali family invitation on the bride's peacock card, the wedding-day timeline, and the red venue/map section with a footer. Small red hearts twinkle down both screen edges while scrolling; all motion respects reduced-motion settings.

Images live in `public/images/` as AVIF/WebP. The invitation opens with an envelope video (`src/components/InvitationCover.tsx`): `public/open-mobile.mp4` in portrait orientation and `public/open-desktop.mp4` (cropped to the envelope) in landscape, with first-frame posters in `images/open-*-poster.webp` so the envelope appears instantly. The source clips are only 480 px wide, so they are upscaled (Lanczos + light sharpening) to 900×1600 and 1200×750 to stay crisp on phone and laptop screens. Tapping the gold seal plays the clip: on mobile the full clip with all its sparks, then the invitation fades in (about 2.5 s); on desktop it is sped up slightly and fades in from its white flash (about 2.3 s). The front page plays a muted, looping swan video (`src/components/HeroVideo.tsx`): `public/wedding.{webm,mp4}` in portrait orientation (phones, portrait tablets) and `public/weddinglaptop.{webm,mp4}` in landscape, with `images/hero-poster-*.webp` shown until it plays. Only the matching clip downloads, after the page has loaded. The names sit in the sky above the swans and sparkle again on every loop. Original uncompressed videos are in `../wedding-invitation-backup-2026-11-06/original-videos/`. The traditional invitation card uses the bride's `peacock.jpeg`, cut into `peacock-frame-top/-middle/-bottom` so it can grow with its content. Fonts are self-hosted via `next/font`. The Nepali (Devanagari) fonts in `src/fonts/` are cut down to only the characters the invitation uses (~25 KB each instead of ~120 KB); if you add new Nepali text, regenerate them with fontTools (`pyftsubset <font>.woff2 --text-file=chars.txt --layout-features='*' --flavor=woff2`) or some letters may fall back to a system font.

The live countdown uses 25 November 2026 for २०८३ मंसिर ०९, verified against the [Nepali Calendar 2083 Mangsir listing](https://nepalicalendar.rat32.com/2083/mangsir). The Gregorian weekday is Wednesday. Its 9:00 AM Nepal-time target is the first confirmed event (guest arrival and pre-wedding feast), not a ceremony start; ceremony and reception times remain unannounced.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
