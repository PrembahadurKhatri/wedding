import { weddingDetails } from "@/data/wedding";

function compact(date: string, time: string) {
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

/** Pre-filled Google Calendar "create event" link. `ctz` makes the floating times local to Nepal. */
export function googleCalendarUrl() {
  const { title, date, startTime, endTime, timeZone, location, description } = weddingDetails.calendar;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compact(date, startTime)}/${compact(date, endTime)}`,
    ctz: timeZone,
    location,
    details: description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
