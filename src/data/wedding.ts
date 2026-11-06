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
    directionsQuery: "Kantipur Garden Batika, Pokhara, Nepal",
  },
  // Google Calendar "Save the Date" event. Times are local to timeZone.
  // TODO(review): endTime is an assumption — no end time has been announced.
  calendar: {
    title: "Wedding of Aashma Timilsina & Diwas Sapkota",
    date: "2026-11-25",
    startTime: "09:00",
    endTime: "18:00",
    timeZone: "Asia/Kathmandu",
    location: "Kantipur Garden Batika (कान्तिपुर गार्डेन पार्टी प्यालेस), Chauthe, Pokhara-14, Nepal",
    description:
      "Join us to celebrate the wedding of Aashma Timilsina and Diwas Sapkota. Guest arrival & pre-wedding feast from 9:00 AM; wedding procession at 1:00 PM.",
  },
  traditionalInvitation: {
    verse: [
      "मंगलम भगवान विष्णुः",
      "मंगलम गरुडध्वजः ।",
      "मंगलम पुण्डरीकाक्षः",
      "मंगलाय तनो हरिः ॥",
    ],
    brideRole: "कनिष्ठ सुपुत्री",
    brideNameNepali: "सुश्री आश्मा तिमिल्सिना",
    groomRole: "आयुष्मान सुपुत्र",
    groomNameNepali: "श्री दिवस सापकोटा",
    weddingTime: "दिउँसो १:०० बजे",
    feastTime: "बिहान ९:०० बजे",
    message:
      "सुसम्पन्न हुने शुभविवाह कार्यक्रममा वर–वधूलाई आशीर्वाद तथा शुभकामना प्रदान गर्न यहाँको गरिमामय उपस्थितिका लागि हार्दिक निमन्त्रणा गर्दछौँ।",
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
      time: "२०८३ मंसिर ०९ गते, बुधबार",
      title: "Wedding ceremony",
      titleNepali: "विवाह समारोह",
    },
  ],
} as const;
