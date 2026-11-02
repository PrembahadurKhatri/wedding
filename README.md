# Wedding Invitation

A standalone, responsive Next.js wedding invitation for Aashma Timilsina and Diwas Sapkota. Names, family details, Nepali date, venue, schedule details, and traditional invitation copy are centralized in `src/data/wedding.ts`. The page flows from the invitation cover to a welcome message, a scratch-to-reveal heart/date card, a live countdown, a printable Nepali family invitation, the wedding-day timeline, and a heart-themed red venue/map section with a footer. Sections use staggered scroll reveals, breathing ornaments, and a rosefall from both screen edges while scrolling, with reduced-motion support.

The supplied photographs are stored under `public/images/`: `desktop.png` is used for the desktop hero and `ai.jpeg` for the mobile hero. The opening cover uses `invite-desktop.png` on desktop and `invite-cover.png` on mobile. Tapping the cover triggers a falling rose, petals, and a velvet-curtain reveal; the cover keeps the couple's names off it and respects reduced-motion preferences. The date card supports pointer/touch scratching and an accessible reveal button. The final venue section includes a Google Maps embed and directions link.

The live countdown uses 25 November 2026 for २०८३ मंसिर ०९, verified against the [Nepali Calendar 2083 Mangsir listing](https://nepalicalendar.rat32.com/2083/mangsir). The Gregorian weekday is Wednesday. Its 9:00 AM Nepal-time target is the first confirmed event (guest arrival and pre-wedding feast), not a ceremony start; ceremony and reception times remain unannounced.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
