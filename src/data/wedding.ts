export const weddingDetails = {
  monogram: "A & D",
  bride: {
    nameEnglish: "Aashma Timilsina",
    nameNepali: "आश्मा तिमिल्सिना",
    father: "श्रीमान् दिल्लीराम तिमिल्सिना",
    mother: "श्रीमती शुभद्रा तिमिल्सिना",
    address: "पोखरा–१०, शिव मार्ग",
  },
  groom: {
    nameEnglish: "Diwas Sapkota",
    nameNepali: "दिवास सापकोटा",
    father: "श्रीमान् लक्ष्मण सापकोटा",
    mother: "श्रीमती निर्मला सापकोटा",
    address: "हेटौंडा–११, नवलपुर",
  },
  dateNepali: "२०८३ मंसिर ०९ गते, बुधबार",
  countdown: {
    // Mangsir 09, 2083 maps to November 25, 2026 on the cited 2083 calendar.
    gregorianDate: "2026-11-25",
    gregorianDateLabel: "25 November 2026",
    time: "09:00",
    timeZone: "Asia/Kathmandu",
    utcOffset: "+05:45",
    targetDescription: "The first confirmed event · Pre-wedding feast",
  },
  venue: {
    name: "कान्तिपुर गार्डेन पार्टी प्यालेस",
    location: "पोखरा–१४, चाउथे",
    directionsQuery: "Kantipur Garden Party Palace, Pokhara, Nepal",
  },
  schedule: [
    {
      time: "9:00 AM",
      title: "Guest arrival & pre-wedding feast",
      titleNepali: "अतिथि आगमन तथा प्रितिभोज",
    },
    {
      time: "1:00 PM",
      title: "Wedding procession",
      titleNepali: "वरियात प्रस्थान",
    },
    {
      time: "To be announced",
      title: "Wedding ceremony",
      titleNepali: "विवाह समारोह",
    },
    {
      time: "To be announced",
      title: "Reception",
      titleNepali: "स्वागत समारोह",
    },
  ],
} as const;
